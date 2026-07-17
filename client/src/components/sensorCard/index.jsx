import { CircularProgress } from "@mui/material";
import { useI18n } from "../../i18n";
import { classes } from "../../styles/classes";

const GAUGE_SIZE = 250;
const GAUGE_THICKNESS = 3;

// A tile's arc offset is its start angle: 90° (12 o'clock) plus the threshold's
// share of the circle. Kept identical to the original inline formula.
/**
 * Convert percentage to CircularProgress rotation.
 *
 * @param {number} percent - Percentage around gauge.
 * @returns {string} CSS rotate value.
 */
function arcRotation(percent) {
  return `rotate(${Math.floor(90 + (percent * 360) / 100) + 1}deg)`;
}

// The six stacked CircularProgress rings: three coloured segments (below-lower,
// in-range, above-upper) over three grey track segments. `av`/`al`/`au` are the
// value / lower / upper expressed as a percentage of the ring (0–100).
/**
 * Render stacked gauge arcs for value and threshold bands.
 *
 * @param {{av: number, al: number, au: number, color: string}} props - Gauge props.
 * @returns {JSX.Element} Gauge arc layers.
 */
function GaugeArcs({ av, al, au, color }) {
  // Length of the in-range (middle) coloured segment.
  let inRangeValue = 0;
  if (av > au) {
    inRangeValue = au - al - 0.4;
  } else if (av > al) {
    inRangeValue = av - al - 0.4;
  }
  return (
    <>
      <CircularProgress
        variant="determinate"
        value={av < al ? av : al - 0.1}
        size={GAUGE_SIZE}
        thickness={GAUGE_THICKNESS}
        color={color}
        style={{ transform: "rotate(90deg)", zIndex: 2 }}
      />
      <CircularProgress
        variant="determinate"
        value={inRangeValue}
        size={GAUGE_SIZE}
        thickness={GAUGE_THICKNESS}
        color={color}
        style={{ transform: arcRotation(al), position: "absolute", zIndex: 2 }}
      />
      <CircularProgress
        variant="determinate"
        value={av > au ? av - au - 0.4 : 0}
        size={GAUGE_SIZE}
        thickness={GAUGE_THICKNESS}
        color={color}
        style={{ transform: arcRotation(au), position: "absolute", zIndex: 2 }}
      />
      <CircularProgress
        variant="determinate"
        value={al - 0.01}
        size={GAUGE_SIZE}
        thickness={GAUGE_THICKNESS}
        style={{ color: "lightGray", transform: "rotate(90deg)", position: "absolute", zIndex: 1 }}
      />
      <CircularProgress
        variant="determinate"
        value={au - al - 0.4}
        size={GAUGE_SIZE}
        thickness={GAUGE_THICKNESS}
        style={{ color: "lightGray", transform: arcRotation(al), position: "absolute", zIndex: 1 }}
      />
      <CircularProgress
        variant="determinate"
        value={100 - au - 0.4}
        size={GAUGE_SIZE}
        thickness={GAUGE_THICKNESS}
        style={{ color: "lightGray", transform: arcRotation(au), position: "absolute", zIndex: 1 }}
      />
    </>
  );
}

/**
 * Render one threshold number input when data is ready.
 *
 * @param {{label: string, value: number|string, onChange: Function, onKeyDown: Function, show: boolean}} props - Field props.
 * @returns {JSX.Element} Threshold field.
 */
function ThresholdField({ label, value, onChange, onKeyDown, show }) {
  return (
    <div>
      {label}
      {show && (
        <div className="mx-auto w-[96px] h-[44px]">
          <input
            type="number"
            className={classes.thresholdInput}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
        </div>
      )}
    </div>
  );
}

// One sensor tile: title, radial gauge, and the lower/upper threshold inputs.
// `arc(info)` maps the sensor's info to the {value, lower, upper} percentages
// the gauge draws (raw for most sensors, percent-scaled for light).
/**
 * Render one sensor tile with gauge and threshold inputs.
 *
 * @param {object} props - Sensor card props.
 * @returns {JSX.Element} Sensor card.
 */
export default function SensorCard({
  title,
  subtitle,
  loading,
  info,
  arc,
  unit,
  iconGood,
  iconWarn,
  normalKey,
  warnKey,
  onLowerChange,
  onUpperChange,
  onKeyDown,
}) {
  const { t } = useI18n();
  const ready = !loading && Boolean(info);
  const { value: av, lower: al, upper: au } = ready
    ? arc(info)
    : { value: 0, lower: 0, upper: 0 };

  return (
    <div className={`col-span-1 ${classes.panel} pb-[var(--spacing-y)]`}>
      <div name="title-subtitle" className={classes.panelTitle}>
        <div name="title" className="font-bold">
          {title}
        </div>
        <div name="subtitle">{subtitle}</div>
      </div>
      <div className="w-[300px] mx-auto mt-[var(--spacing-y)]">
        <div className="flex flex-col justify-center items-center">
          {!ready ? (
            <div className="w-[250px] h-[250px] flex items-center justify-center">
              <CircularProgress variant="indeterminate" value={50} size={50} thickness={3} />
            </div>
          ) : (
            <div className="relative inline-flex">
              <GaugeArcs av={av} al={al} au={au} color={info.needNoti ? "warning" : "success"} />
              <div className="w-full h-full rounded-full bg-lightGray z-0 absolute"></div>
              <div className="flex top-0 left-0 bottom-0 right-0 absolute justify-center items-center">
                <div className="flex flex-col justify-center items-center">
                  <img alt="" src={info.needNoti ? iconWarn : iconGood} />
                  <div
                    className={
                      "font-bold text-[1.5rem] text-center" +
                      (info.needNoti ? " text-warning" : " text-success")
                    }
                  >
                    {info.value} {unit}
                    <div className="font-normal text-[1rem]">
                      {info.needNoti ? t(warnKey) : t(normalKey)}
                    </div>
                  </div>
                  <div>{info.time}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          name="threshold"
          className="mx-[var(--spacing-x)] mt-[var(--spacing-y)] flex justify-between"
        >
          <ThresholdField
            label={t("common.lowerThreshold")}
            value={ready ? info.lowerThreshold : ""}
            onChange={onLowerChange}
            onKeyDown={onKeyDown}
            show={ready}
          />
          <ThresholdField
            label={t("common.upperThreshold")}
            value={ready ? info.upperThreshold : ""}
            onChange={onUpperChange}
            onKeyDown={onKeyDown}
            show={ready}
          />
        </div>
      </div>
    </div>
  );
}
