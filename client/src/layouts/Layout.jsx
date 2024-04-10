import React, {useEffect} from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
	return (
		<>	
			<div className="bg-neutral-100 h-screen w-screen m-0 overflow-hidden flex flex-row">
				<Sidebar />
				<div className="flex flex-col flex-1">
					<Header />
					<div className="flex-1 p-[20px] overflow-x-hidden">
						<Outlet />
					</div>
				</div>
			</div>
		</>
	)
}
