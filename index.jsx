import React, { useState } from 'react';
import LastValues from '../../components/lastValues';
import PumpInfo from '../../components/pumpInfo'
import History from '../../components/history'

export default function Dashboard() {
	return (
		<div>
			<div className='lg:flex md:block w-full h-[1000px] gap-[20px]'>
				<LastValues/>
			<div>
				<div className="pb-4">
					<PumpInfo/>
				</div>
				<div>
					<History/>
				</div>
				
				
			</div>
			</div>	
		</div>
	);      
}