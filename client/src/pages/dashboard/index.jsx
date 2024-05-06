import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LastValues from '../../components/lastValues';
import PumpInfo from '../../components/pumpInfo'
import History from '../../components/history'

export default function Dashboard() {
	const [sessionID, setSessionID] = useState(localStorage.getItem('sessionID'));
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
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
					<div className='lg:flex md:block w-full h-[1000px] gap-[20px]'>
					<LastValues api_token={sessionID}/>
					<div>
					<PumpInfo api_token={sessionID}/>
					<br></br>
					<History api_token={sessionID}/>
					</div>
				</div>		
			)}
		</div>
	);      
}
