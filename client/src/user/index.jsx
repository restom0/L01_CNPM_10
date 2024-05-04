import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

const cookies = new Cookies();
export default function User() {
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
					<div className="bg-white w-[400px] h-[200px] p-10">
						<p className="text-lg font-semibold pb-2">Tài khoản: abc</p>
						<p className="text-lg font-semibold pb-2">Mật khẩu: abc</p>
						<p className="text-lg font-semibold pb-2">Tài khoản Adafruit: abc</p>
					</div>		
				</div>		
			)}
		</div>
	);      
}
