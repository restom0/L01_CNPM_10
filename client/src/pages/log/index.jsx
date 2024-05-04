import React, { useState, useEffect } from 'react';
import loginBackground from '../../assets/images/login_background.png';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import History from '../../components/history'

const cookies = new Cookies();

export default function Log() {
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
                <div>
                    {/* <History api_token={sessionID}/> */}
                </div>
			)}
		</div>
	);      
}
