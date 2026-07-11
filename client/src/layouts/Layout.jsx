import React from 'react'
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
					<div className="flex-1 px-[var(--spacing-body)] py-[var(--spacing-section)] overflow-x-hidden overflow-y-auto">
						<Outlet />
					</div>
				</div>
			</div>
		</>
	)
}
