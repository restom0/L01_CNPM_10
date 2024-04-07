import React, { useState } from 'react';
import LastValues from '../../components/lastValues';

export default function Dashboard() {
	return (
		<div>
			<div className='flex w-full h-[1000px]'>
				<LastValues />
				<div className='w-1/3'></div>
			</div>
		</div>
	);      
}
