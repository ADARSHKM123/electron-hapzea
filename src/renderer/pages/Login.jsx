import React from 'react';
import './login.css';
import logo from '../assets/logo512.png';
import gLogo from '../assets/google.png';
import { FiMail, FiLock } from 'react-icons/fi';

export default function Login() {
    return (
        <div className="hp-login__wrapper">
            <img src={logo} className="hp-login__logo" alt="hapzea" />

            <form className="hp-login__form">
                <div className="hp-input">
                    <FiMail className="hp-input__icon" />
                    <input placeholder="Username or Email" />
                </div>
                <div className="hp-input">
                    <FiLock className="hp-input__icon" />
                    <input type="password" placeholder="Password" />
                </div>
                <button className="hp-btn">Login</button>
            </form>

            <div className="hp-divider" />

            <button className="hp-google"
                onClick={handleGoogle}
                disabled={loading}
                title="Sign in with Google">
                <img src={gLogo} alt="Google" />
            </button>
        </div>
    );
}
