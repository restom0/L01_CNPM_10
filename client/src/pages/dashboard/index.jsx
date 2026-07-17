import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LastValues from '../../components/lastValues';
import PumpInfo from '../../components/pumpInfo'
import History from '../../components/history'

/**
 * Render dashboard page after auth marker check.
 *
 * @returns {JSX.Element} Dashboard page.
 */
export default function Dashboard() {
	const sessionID = localStorage.getItem('sessionID');
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
        /**
         * Verify local auth marker before showing dashboard.
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
					<div className='flex flex-col gap-y-[var(--spacing-section)]'>
					<PumpInfo api_token={sessionID}/>
					<History api_token={sessionID}/>
					</div>
				</div>		
			)}
		</div>
	);      
}
