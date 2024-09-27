import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'bulma-toast';
import { useNavigate, Link } from 'react-router-dom'; // Add Link here

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const submitForm = (e) => {
        e.preventDefault(); // Prevent default form submission
        setErrors([]);

        if (username === '') {
            setErrors(prevErrors => [...prevErrors, 'The username is missing']);
        }

        if (password === '') {
            setErrors(prevErrors => [...prevErrors, 'The password is too short']);
        }

        if (password !== password2) {
            setErrors(prevErrors => [...prevErrors, 'The passwords don\'t match']);
        }

        if (errors.length === 0) {
            const formData = {
                username: username,
                password: password,
            };

            axios
                .post('/core/v1/users/', formData)
                .then(response => {
                    toast({
                        message: 'Account created, please log in!',
                        type: 'is-success',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: 'bottom-right',
                    });

                    navigate('/log-in'); // Use navigate to redirect
                })
                .catch(error => {
                    if (error.response) {
                        for (const property in error.response.data) {
                            setErrors(prevErrors => [...prevErrors, `${property}: ${error.response.data[property]}`]);
                        }
                        console.log(JSON.stringify(error.response.data));
                    } else if (error.message) {
                        setErrors(prevErrors => [...prevErrors, 'Something went wrong. Please try again']);
                        console.log(JSON.stringify(error));
                    }
                });
        }
    };

    return (
        <div className="page-sign-up">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 offset-md-4">
                        <h1 className="title">Sign up</h1>
                        <form onSubmit={submitForm}>
                            <div className="mb-3">
                                <label>Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Repeat password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
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
                                <button className="btn btn-dark">Sign up</button>
                            </div>

                            <hr />

                            Or <Link to="/log-in">click here</Link> to log in!
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
