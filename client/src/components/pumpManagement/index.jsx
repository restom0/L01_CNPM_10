import PumpState from '../pumpState'
import AddPumpAuto from '../addPumpAuto'
import ShowPumpAuto from '../showPumpAuto'
import React, { useState } from 'react';
import { FormGroup, Typography, Switch, Stack } from '@mui/material';
import { useI18n } from '../../i18n';
import { classes } from '../../styles/classes';

/**
 * Render pump management card with manual and automatic watering modes.
 *
 * @param {{api_token: string}} props - Auth token props.
 * @returns {JSX.Element} Pump management card.
 */
export default function PumpInfo(props) {
    const [autoMode, setAutoMode] = useState(false); // State to manage the auto mode
    const { t } = useI18n();

    return (
        <div className='md:w-[280px] xl:w-[400px] 2xl:w-[400px]'>
            <div className={classes.panel}>
                <div name='title-subtitle' className={classes.panelTitle}>
                    <div name='title' className='font-bold'>
                        {t('pump.management')}
                    </div>
                </div>
                <hr className={classes.separator}></hr>
                <div className='pl-[var(--spacing-x)] pt-[var(--spacing-y)]'>
                    {t('pump.chooseMode')}
                    <FormGroup>
                        {t('pump.pump1')}
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Typography>{t('pump.manual')}</Typography>
                            <Switch checked={autoMode} onChange={() => setAutoMode(!autoMode)} />
                            <Typography>{t('pump.auto')}</Typography>
                        </Stack>
                    </FormGroup>
                    {autoMode && <ShowPumpAuto api_token={props.api_token}/>}
                </div>


                <div>
                    {autoMode && 
                    <div>
                        <hr className={classes.separator}></hr>
                        <AddPumpAuto api_token={props.api_token}/>
                    </div>
                    }
                </div>

                <hr className={classes.separator}></hr>
                <PumpState api_token={props.api_token} />
            </div>
        </div>
    );
}
