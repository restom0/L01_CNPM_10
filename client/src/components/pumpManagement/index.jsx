import PumpState from '../pumpState'
import AddPumpAuto from '../addPumpAuto'
import ShowPumpAuto from '../showPumpAuto'
import React, { useState } from 'react';
import { FormGroup, Typography, Switch, Stack } from '@mui/material';
import { useI18n } from '../../i18n';

export default function PumpInfo(props) {
    const [autoMode, setAutoMode] = useState(false); // State to manage the auto mode
    const { t } = useI18n();

    return (
        <div className='md:w-[280px] xl:w-[400px] 2xl:w-[400px]'>
            <div className='bg-white'>
                <div name='title-subtitle' className='pl-[var(--spacing-x)] pt-[var(--spacing-y)]'>
                    <div name='title' className='font-bold'>
                        {t('pump.management')}
                    </div>
                </div>
                <hr className="mt-[var(--spacing-section)] border border-solid"></hr>
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
                        <hr className="mt-[var(--spacing-section)] border border-solid"></hr>
                        <AddPumpAuto api_token={props.api_token}/>
                    </div>
                    }
                </div>

                <hr className="mt-[var(--spacing-section)] border border-solid"></hr>
                <PumpState api_token={props.api_token} />
            </div>
        </div>
    );
}
