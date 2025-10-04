import React, { useState } from 'react';
import './Auth.css';

function Register({ onRegisterSuccess, onSwitchToLogin }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://localhost:8443/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, email, password }),
            });

            const result = await response.text();
            setMessage(result);

            if (response.ok) {
                // Auto-switch to login after successful registration
                setTimeout(() => {
                    window.location.hash = 'login';
                }, 2000);
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    return (
        <div className="auth-box">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Register</button>
            </form>

            {message && <p className="message">{message}</p>}
            <p className="login-link">
                Already have an account?{" "}
                <span
                    onClick={onSwitchToLogin}
                    style={{ color: "#00aaff", cursor: "pointer", fontWeight: "bold" }}
                >
    Login
  </span>
            </p>

        </div>
    );
}

export default Register;