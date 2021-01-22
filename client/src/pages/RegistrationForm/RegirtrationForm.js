import React, {useState} from "react";
import { Link } from "react-router-dom";
import API from "../../utils/API";
import './RegistrationForm.css';
import {ACCESS_AUTHENTICATED} from "../../constants/apiConstants";

import { withRouter } from "react-router-dom";
function RegistrationForm(props) {
    const [state, setState] = useState({
        first_name: "",
        last_name: "",
        email : "",
        password : "",
        confirmPassword: "",
        successMessage: null
    })
    
    const handleChange = (e) => {
        const {id, value} = e.target
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const sendDetailsToServer = () => {
        if(state.email.length && state.password.length && state.first_name && state.last_name) {
            const payload={
                "first_name": state.first_name,
                "last_name": state.last_name,
                "email":state.email,
                "password":state.password,
            }
            API.registerUser(payload)
               .then(function (response) {
                    if(response.status === 200){
                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Registration successful. Redirecting to home page..'
                        }))
                        localStorage.setItem(ACCESS_AUTHENTICATED,"true");
                        console.log("Success");        
                        props.showError(null)
                    } else{
                        console.log("Error");
                        props.showError("Some error ocurred");
                    }
                })
                .catch(function (error) {
                    // console.log(error);
                });    
        } else {
            props.showError('Please enter valid username and password')    
        }
        
    }
    const redirectToLogin = () => {
        this.props.history.push('/');
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if(state.password === state.confirmPassword) {
            sendDetailsToServer()    
        } else {
            props.showError('Passwords do not match');
        }
    }
    return(
        
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="InputFistName">First Name</label>
                    <input type="text" 
                            className="form-control" 
                            id="first_name" 
                            aria-describedby="firstNameHelp" 
                            placeholder="Enter First Name"
                            value={state.first_name}
                            onChange={handleChange}
                        />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="InputLastName">Last Name</label>
                    <input type="text" 
                            className="form-control" 
                            id="last_name" 
                            aria-describedby="lastNameHelp" 
                            placeholder="Enter Last Name"
                            value={state.last_name}
                            onChange={handleChange}
                        />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="InputEmail1">Email address</label>
                    <input type="email" 
                            className="form-control" 
                            id="email" 
                            aria-describedby="emailHelp" 
                            placeholder="Enter email"
                            value={state.email}
                            onChange={handleChange}
                        />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="InputPassword1">Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="password" 
                        placeholder="Password"
                        value={state.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="InputPassword1">Confirm Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="confirmPassword" 
                        placeholder="Confirm Password"
                        value={state.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    Register
                </button>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={redirectToLogin}
                >
                    Login
                </button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="mt-2">
                <span>Already have an account? </span>
                <Link to="/login">Login here</Link>
            </div>
        </div>
        
    )
}

export default withRouter(RegistrationForm);