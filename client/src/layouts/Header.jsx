import React, { useState } from 'react'
import { IoMdSettings, IoIosNotifications } from 'react-icons/io'
import { Link } from 'react-router-dom'
import SettingsDialog from '../components/settingsDialog'
import { useI18n } from '../i18n'
import { classes } from '../styles/classes'

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
					className={classes.headerIconButton}
				>
					<IoMdSettings size={22} />
				</button>
				<button
					type="button"
					aria-label={t('nav.user')}
					className={classes.headerIconButton}
				>
					<IoIosNotifications size={22} />
				</button>
			</div>
			<SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
		</div>
	)
}
