import PumpState from '../pumpState'
import AddPumpAuto from '../addPumpAuto'
import ShowPumpAuto from '../showPumpAuto'
import React, { useState } from 'react';
import { FormGroup, Typography, Switch, Stack } from '@mui/material';

export default function PumpInfo(props) {
    const [autoMode, setAutoMode] = useState(false); // State to manage the auto mode

    return (
        <div className='md:w-[280px] xl:w-[400px] 2xl:w-[400px]'>
            <div className='bg-white'>
                <div name='title-subtitle' className='pl-1 pt-2'>
                    <div name='title' className='font-bold'>
                        Quản lý máy bơm
                    </div>
                </div>
                <hr className="mt-4 border border-solid"></hr>
                <div className='pl-1 pt-2'>
                    Chọn chế độ
                    <FormGroup>
                        Máy bơm 1
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography>Thủ công</Typography>
                            <Switch checked={autoMode} onChange={() => setAutoMode(!autoMode)} />
                            <Typography>Tự động</Typography>
                        </Stack>
                    </FormGroup>
                    {autoMode && <ShowPumpAuto api_token={props.api_token}/>}
                </div>


                <div>
                    {autoMode && 
                    <div>
                        <hr className="mt-4 border border-solid"></hr>
                        <AddPumpAuto api_token={props.api_token}/>
                    </div>
                    }
                </div>

                <hr className="mt-4 border border-solid"></hr>
                <PumpState api_token={props.api_token} />
            </div>
        </div>
    );
}
