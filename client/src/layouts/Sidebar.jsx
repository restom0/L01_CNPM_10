import React from 'react'
import axios from 'axios'
import classNames from 'classnames'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiHome, HiChartBar, HiLogout} from 'react-icons/hi'
import { IoBuild } from 'react-icons/io5'
import { HiDocument } from 'react-icons/hi2'
import { useI18n } from '../i18n';
import { getTranslatedApiErrorMessage } from '../utils/apiError';

const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		labelKey: 'nav.dashboard',
		path: '/dashboard',
		icon: <HiHome/>
	},
	{
		key: 'chart',
		labelKey: 'nav.chart',
		path: '/chart',
		icon: <HiChartBar />
	},
	{
		key: 'setting',
		labelKey: 'nav.setting',
		path: '/setting',
		icon: <IoBuild />
	},
	{
		key: 'log',
		labelKey: 'nav.log',
		path: '/log',
		icon: <HiDocument />
	},
	// {
	// 	key: 'user',
	// 	labelKey: 'nav.user',
	// 	path: '/user',
	// 	icon: <HiUser />
	// }
]


function SidebarLink({ link }) {
	const { pathname } = useLocation()
	const { t } = useI18n()

	return (
		<Link
			to={link.path}
			className={classNames(pathname === link.path ? 'bg-lightGray text-mainBlue' : 'text-textGray', linkClass)}
		>
			<span className="text-xl">{link.icon}</span>
			{t(link.labelKey)}
		</Link>
	)
}

const linkClass =
	'flex items-center gap-x-[var(--spacing-x)] px-[var(--spacing-x)] py-[var(--spacing-y)] hover:bg-lightGray hover:no-underline rounded-[8px] text-base font-semibold'

export default function Sidebar() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const handleLogout = async () => {
        try {
            try {
                await axios.post('http://localhost:3001/logout');
            } catch {
                // Offline/demo mode has no backend; clearing the local marker is enough.
            }
            localStorage.removeItem('sessionID');
            navigate('/login');
        }catch (error) {
            alert(getTranslatedApiErrorMessage(t, error));
        }
    };
	return (
		<div className="bg-white w-[260px] pt-[var(--spacing-section)] px-[var(--spacing-x)] flex flex-col">
			<div className="flex flex-1 flex-col gap-y-[var(--spacing-y)]">
				{DASHBOARD_SIDEBAR_LINKS.map((link) => (
					<SidebarLink key={link.key} link={link} />
				))}
			</div>
			
			<div className="flex flex-col gap-y-[var(--spacing-y)] pt-[var(--spacing-y)] rounded-md">
				<button type='button' className={classNames(linkClass, 'cursor-pointer text-mainRed mb-[var(--spacing-y)] hover:bg-lightRed ')} onClick={handleLogout}>
					<span className="text-xl">
						<HiLogout />
					</span>
					{t('nav.logout')}
				</button>
			</div>
		</div>
	)
}

