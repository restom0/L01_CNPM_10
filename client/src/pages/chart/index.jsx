import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Charts from '../../components/chart'

export default function Chart() {
	const [sessionID, setSessionID] = useState(localStorage.getItem('sessionID'));
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
        const fetchApiData = async () => {
			try {
				//const loginResponse = await axios.post(`http://localhost:3001/login`,{username: 'rang',password: 'rang'});
                //setSessionID(loginResponse.data.api_token);
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