import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LastValues from '../../components/lastValues';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import PumpInfo from '../../components/pumpInfo'

export default function Setting() {
	const [sessionID, setSessionID] = useState('');
	const [loading, setLoading] = useState(true);
	useEffect(() => {
        const fetchApiData = async () => {
			try {
				const loginResponse = await axios.post(`http://localhost:3001/login`,{username: 'rang',password: 'rang'});
                setSessionID(loginResponse.data.api_token);
				setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchApiData();
    }, []);
	return (
		<div>
			{loading ? (
                <div></div>
                ) : (
					<div className='lg:flex md:block w-full h-[1000px] gap-[20px]'>
					<LastValues api_token={sessionID}/>
				</div>		
			)}
		</div>
	);      
}
