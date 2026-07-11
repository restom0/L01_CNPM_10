import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n';

export default function User() {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { t } = useI18n();
	useEffect(() => {
        const fetchApiData = async () => {
			try {
				if (!localStorage.getItem('sessionID')){
					navigate('/login');
				}
				setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchApiData();
    }, [navigate]);
	return (
		<div>
			{loading ? (
                <div></div>
                ) : (
				<div className='lg:flex md:block w-full min-h-[1000px] gap-x-[var(--spacing-x)] gap-y-[var(--spacing-section)]'>
					<div className="bg-white w-[400px] h-[200px] p-[var(--spacing-section)]">
						<p className="text-lg font-semibold pb-[var(--spacing-x)]">{t('user.account')}</p>
						<p className="text-lg font-semibold pb-[var(--spacing-x)]">{t('user.password')}</p>
						<p className="text-lg font-semibold pb-[var(--spacing-x)]">{t('user.adafruitAccount')}</p>
					</div>		
				</div>		
			)}
		</div>
	);      
}
