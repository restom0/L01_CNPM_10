import React from 'react'
import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { HiHome, HiChartBar, HiUser, HiLogout} from 'react-icons/hi'
import { IoBuild } from 'react-icons/io5'
import { HiDocument } from 'react-icons/hi2'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Bảng điều khiển',
		path: '/dashboard',
		icon: <HiHome/>
	},
	{
		key: 'chart',
		label: 'Biểu đồ',
		path: '/chart',
		icon: <HiChartBar />
	},
	{
		key: 'setting',
		label: 'Quản lý chung',
		path: '/setting',
		icon: <IoBuild />
	},
	{
		key: 'log',
		label: 'Nhật ký',
		path: '/log',
		icon: <HiDocument />
	},
	// {
	// 	key: 'user',
	// 	label: 'Tài khoản',
	// 	path: '/user',
	// 	icon: <HiUser />
	// }
]


function SidebarLink({ link }) {
	const { pathname } = useLocation()

	return (
		<Link
			to={link.path}
			className={classNames(pathname === link.path ? 'bg-lightGray text-mainBlue' : 'text-textGray', linkClass)}
		>
			<span className="text-xl">{link.icon}</span>
			{link.label}
		</Link>
	)
}

const linkClass =
	'flex items-center gap-2 px-3 py-2 hover:bg-lightGray hover:no-underline rounded-[12px] text-base font-semibold'

export default function Sidebar() {
	const navigate = useNavigate();
	const handleLogout = async () => { 
        try {
            localStorage.removeItem('sessionID');
            navigate('/login');
        }catch (error) {
            alert(error);
        }
    };
	return (
		<div className="bg-white w-[260px] pt-[30px] px-[5px] flex flex-col">
			<div className="flex flex-1 flex-col gap-0.5">
				{DASHBOARD_SIDEBAR_LINKS.map((link) => (
					<SidebarLink key={link.key} link={link} />
				))}
			</div>
			
			<div className="flex flex-col gap-0.5 pt-2 rounded-md">
				<button type='button' className={classNames(linkClass, 'cursor-pointer text-mainRed mb-2 hover:bg-lightRed ')} onClick={handleLogout}>
					<span className="text-xl">
						<HiLogout />
					</span>
					Đăng xuất
				</button>
			</div>
		</div>
	)
}

