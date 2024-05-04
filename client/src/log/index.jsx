import React, { useState, useEffect } from 'react';
import loginBackground from '../../assets/images/login_background.png';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import History from '../../components/history';
import SeHistory from '../../components/selectedLog'

const cookies = new Cookies();

export default function Log() {
    return (
        <div>
            <SeHistory/>
        </div>
    );      
}
