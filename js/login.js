// LoginPage.js
import React, { useState } from 'react';

const BASE_URL = 'http://localhost:8080/hms/';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  // Check if the user is already logged in
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = 'admin.html'; // Redirect to admin page if token exists
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setAlertMessage('');

    // Validate inputs
    if (email === '' || password === '') {
      setAlertMessage('Email and password must not be empty');
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }

    const user = {
      username: email,
      password: password,
    };

    const data = JSON.stringify(user);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    };

    try {
      const response = await fetch(`${BASE_URL}login`, options);

      if (response.status === 200) {
        const res = await response.json();
        localStorage.setItem('token', 'Bearer ' + res.token);
        localStorage.setItem('username', res.user.fullName);
        localStorage.setItem('user_id', res.user.id);
        window.location.href = 'admin.html'; // Redirect to admin page after login
      } else {
        const res = await response.json();
        let errMsg = '';
        Object.keys(res).forEach((key) => {
          if (res[key] !== false) {
            errMsg += `${res[key]}\n`;
          }
        });
        setAlertMessage(errMsg);
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setAlertMessage('An error occurred during login.');
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {alertVisible && (
        <div id="alert-box" className="alert alert-danger">
          {alertMessage}
        </div>
      )}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" id="login">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
