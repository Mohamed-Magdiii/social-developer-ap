import React from "react";
import { Fragment, useState } from "react";
import { Link, Redirect} from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {login} from "../../actions/auth";


//We Will do Login form
export const Login = ({login ,isAuthenticated}) => {
  //using Hooks for useState
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { email, password } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    login(email,password) 
  };

  if(isAuthenticated){
   return <Redirect to="/dashboard"/>
  }

  
  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => onChange(e)}
            name="email"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
       Don't have an account? <Link to="/Register">Sign Up</Link>
      </p>
    </Fragment>
  );
};
 
Login.propTypes={
login:PropTypes.func.isRequired,
isAuthenticated:PropTypes.bool,
}

const mapStateToProp = state =>({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProp, {login})(Login);
