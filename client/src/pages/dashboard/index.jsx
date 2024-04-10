import React, { useState } from 'react';
import LastValues from '../../components/lastValues';
import PumpInfo from '../../components/pumpInfo'

export default function Dashboard() {
	return (
		<div>
			<div className='lg:flex md:block w-full h-[1000px] gap-[20px]'>
				<LastValues/>
				<PumpInfo/>
			</div>	
		</div>
	);      
}
