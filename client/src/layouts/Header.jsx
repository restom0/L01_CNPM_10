import React, { useState } from 'react'
import { IoMdSettings, IoIosNotifications } from 'react-icons/io'
import { Link } from 'react-router-dom'
import SettingsDialog from '../components/settingsDialog'
import { useI18n } from '../i18n'

export default function Header() {
	const { t } = useI18n();
	const [settingsOpen, setSettingsOpen] = useState(false);

	return (
		<div className="bg-blue h-[90px] px-[var(--spacing-body)] flex items-center border-b border-gray-200 justify-between">
			<div className="flex items-center">
				<Link to='/dashboard'>
					<p className="text-white text-[45px]">{t('app.title')}</p>
				</Link>
			</div>
			<div className="flex items-center gap-x-[var(--spacing-x)]">
				<button
					type="button"
					onClick={() => setSettingsOpen(true)}
					aria-label={t('settings.title')}
					className="rounded-md p-1 text-white outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white"
				>
					<IoMdSettings size={22} />
				</button>
				<button
					type="button"
					aria-label={t('nav.user')}
					className="rounded-md p-1 text-white outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white"
				>
					<IoIosNotifications size={22} />
				</button>
			</div>
			<SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
		</div>
	)
}
