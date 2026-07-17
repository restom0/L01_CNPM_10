import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Charts from '../../components/chart'

/**
 * Render charts page after auth marker check.
 *
 * @returns {JSX.Element} Charts page.
 */
export default function Chart() {
	const sessionID = localStorage.getItem('sessionID');
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
        /**
         * Verify local auth marker before showing charts.
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
				<div>
					<Charts api_token={sessionID}/>
				</div>		
			)}
		</div>
	);      
}
