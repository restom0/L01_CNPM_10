import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import LastValues from '../../components/lastValues';
import PumpManagement from '../../components/pumpManagement'

const cookies = new Cookies();
export default function Setting() {
	const [sessionID, setSessionID] = useState('');
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
        const fetchApiData = async () => {
			try {
				//const loginResponse = await axios.post(`http://localhost:3001/login`,{username: 'rang',password: 'rang'});
                //setSessionID(loginResponse.data.api_token);
				setSessionID(cookies.get('sessionID'));
				if (!cookies.get('sessionID')){
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
					<PumpManagement api_token={sessionID}/>
				</div>		
			)}
		</div>
	);      
}
