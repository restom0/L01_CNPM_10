import React from 'react'
import { IoMdSettings, IoIosNotifications } from 'react-icons/io'
import { Link } from 'react-router-dom'
import LanguageSwitcher from '../components/languageSwitcher'
import { useI18n } from '../i18n'

export default function Header() {
	const { t } = useI18n();

	return (
		<div className="bg-blue h-[90px] px-[var(--spacing-body)] flex items-center border-b border-gray-200 justify-between">
			<div className="flex items-center">
				<Link to='/dashboard'>
					<p className="text-white text-[45px]">{t('app.title')}</p>
				</Link>
			</div>
			<div className="flex items-center gap-x-[var(--spacing-x)]">
				<LanguageSwitcher />
				<IoMdSettings cursor={'pointer'} color='white' size={20}/>
				<IoIosNotifications cursor={'pointer'} color='white' size={20}/>
			</div>
		</div>
	)
}
