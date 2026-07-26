import { describe, expect, it } from 'vitest'
import { EnvironmentalDrynessModel } from './EnvironmentalDryness.js'
import { HumidityModel } from './HumiditySensors.js'
import { LightModel } from './LightSensors.js'
import { LogModel } from './Logs.js'
import { MoistureModel } from './MoistureSensors.js'
import { SensorModel } from './Sensors.js'
import { TemperatureModel } from './TemperatureSensors.js'
import { UserModel } from './Users.js'
import { WaterPumpModel } from './WaterPumps.js'
import { WaterPumpTimerModel } from './WaterPumpTimers.js'

describe('mongoose models (UT)', () => {
  it.each([
    [EnvironmentalDrynessModel, 'EnvironmentalDryness'],
    [HumidityModel, 'HumiditySensors'],
    [LightModel, 'LightSensors'],
    [LogModel, 'Logs'],
    [MoistureModel, 'MoistureSensors'],
    [SensorModel, 'Sensors'],
    [TemperatureModel, 'TemperatureSensors'],
    [UserModel, 'User'],
    [WaterPumpModel, 'WaterPumps'],
    [WaterPumpTimerModel, 'WaterPumpTimers']
  ])('registers %s model', (model, name) => {
    expect(model.modelName).toBe(name)
  })
})
