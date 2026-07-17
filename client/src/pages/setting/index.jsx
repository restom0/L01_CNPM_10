import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LastValues from '../../components/lastValues';
import PumpManagement from '../../components/pumpManagement'

/**
 * Render settings page after auth marker check.
 *
 * @returns {JSX.Element} Settings page.
 */
export default function Setting() {
	const sessionID = localStorage.getItem('sessionID');
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
        /**
         * Verify local auth marker before showing settings.
         *
         * @returns {Promise<void>}
         */
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
					<LastValues api_token={sessionID}/>
					<PumpManagement api_token={sessionID}/>
				</div>		
			)}
		</div>
	);      
}
