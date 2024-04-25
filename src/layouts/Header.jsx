import React from 'react'
import { IoMdSettings, IoIosNotifications } from 'react-icons/io'
import { Link } from 'react-router-dom'

export default function Header() {
	return (
		<div className="bg-blue h-[90px] px-[20px] flex items-center border-b border-gray-200 justify-between">
			<div className="flex items-center">
				<Link to='/dashboard'>
					<p className="text-white text-[45px]">IOT Dashboard</p>
				</Link>
			</div>
			<div className="flex items-center gap-2">
				<IoMdSettings cursor={'pointer'} color='white' size={20}/>
				<IoIosNotifications cursor={'pointer'} color='white' size={20}/>
			</div>
		</div>
	)
}
