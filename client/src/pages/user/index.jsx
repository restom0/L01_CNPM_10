import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function User() {
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
