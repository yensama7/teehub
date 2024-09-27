// LogIn component (ensure you pass the setIsLoggedIn function as a prop)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LogIn = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Log In | Djackets';
    }, []);

    const submitForm = async (e) => {
      e.preventDefault();
      setErrors([]);
  
      axios.defaults.headers.common["Authorization"] = "";
      localStorage.removeItem("token");
  
      const formData = { username, password };
  
      try {
          const response = await axios.post('/core/v1/token/login/', formData);
          const token = response.data.auth_token;
  
          localStorage.setItem("token", token);
          axios.defaults.headers.common["Authorization"] = "Token " + token;
  
          setIsLoggedIn(true); // Update the login state
  
          const toPath = new URLSearchParams(window.location.search).get('to') || '/cart';
          navigate(toPath);
      } catch (error) {
          
      }
  };
  

    return (
      <div className="page-log-in">
      <div className="container">
          <div className="row">
              <div className="col-md-4 offset-md-4">
                  <h1 className="title">Log In</h1>
                  <form onSubmit={submitForm}>
                      <div className="mb-3">
                          <label htmlFor="username">Username</label>
                          <input
                              type="text"
                              className="form-control"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              id="username"
                              required
                          />
                      </div>

                      <div className="mb-3">
                          <label htmlFor="password">Password</label>
                          <input
                              type="password"
                              className="form-control"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              id="password"
                              required
                          />
                      </div>

                      {errors.length > 0 && (
                          <div className="alert alert-danger">
                              {errors.map((error, index) => (
                                  <p key={index}>{error}</p>
                              ))}
                          </div>
                      )}

                      <div className="mb-3">
                          <button className="btn btn-dark" type="submit">Log In</button>
                      </div>

                      <hr />

                      Or <Link to="/sign-up">click here</Link> to sign up!
                  </form>
              </div>
          </div>
      </div>
  </div>
    );
};

export default LogIn;
