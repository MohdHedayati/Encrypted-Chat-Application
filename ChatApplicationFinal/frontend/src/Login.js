import React, { useState } from 'react';
import './Auth.css';

function Login({ onLoginSuccess , onSwitchToRegister}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://localhost:8443/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Include session cookie
                body: JSON.stringify({ username, password }),
            });

            const result = await response.text();

            if (response.ok) {
                setMessage(result);
                onLoginSuccess(username);
            } else {
                setMessage(result);
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    return (
        <div className="auth-box">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>

            {message && <p className="message">{message}</p>}
            <p className="register-link">
                Don't have an account?{" "}
                <span
                    onClick={onSwitchToRegister}
                    style={{ color: "#00aaff", cursor: "pointer", fontWeight: "bold" }}
                >
      Register
    </span>
            </p>
        </div>
    );
}

export default Login;