import { Button, Empty, Input, notification } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./index.css"
import validateEmail from "../../utils/validateData";
import axios from 'axios';
import BASE_URL from '../../api';
import { POST } from '../../constants/httpMethod';
import { BAD_REQUEST, CREATE } from '../../constants/httpStatusCode';

export default function Register() {

  const navigate = useNavigate();

  const inputRefFocus = useRef();
  useEffect(() => {
    if(inputRefFocus){
      inputRefFocus.current.focus();
    }
  }, [])


  const handleSubmit = (e) => {
    e.preventDefault();

    const fullnameValid = validateData2("fullname", user.fullname)
    const usernameValid = validateData2("username", user.username)
    const passwordValid = validateData2("password", user.password)
    const emailValid = validateData2("email", user.email)
    if(fullnameValid && usernameValid && passwordValid && emailValid){
      // Call a API to register     
      //Method 2
      BASE_URL[POST]("/auth/signup", user)
      .then((response) => {
        const statusCode = response?.status;
        if(statusCode == CREATE){
          //show notification
          notification.success({
            message: "Success",
            description: "Register an account success."
          })
          //navigate to login page
          navigate("/login")
        }
      })
      .catch((error) => {
        console.log(error.response)
        const statusCode = error?.response?.status;
        const errorMessage = Object.values(error?.response?.data)[1]
        switch (statusCode){
          case BAD_REQUEST:
            notification.error({
              message: "Warning",
              description: errorMessage
            })
            break;

          default:
            notification.error({
              message: "Warning",
              description: "An error has occurred. Please contact your Administrators for assistance."
            })
            break;
        }
      });
      
    }
  }

  const [fullnameError, setFullnameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateData = (name, value) => {
    let isValid = true;
    switch(name){
      case "fullname":
        if(!value){
          setFullnameError("Full Name is required.")
          isValid = false;
        } else {
          setFullnameError("");
        }
        break;
      case "username":
        if(!value){
          setUsernameError("Username is required.")
          isValid = false;
        } else {
          setUsernameError("");
        }
        break;
      case "password":
        if(!value){
          setPasswordError("Password is required.")
          isValid = false;
        } else {
          if(value.length < 8){
            setPasswordError("Encryption password must have atleast 8 characters.");
            isValid = false;
          } else {
            setPasswordError("");
          }
        }
        break;
      case "email":
        if(!value){
          setEmailError("Email is required.")
          isValid = false;
        } else {
          if(!validateEmail(value)){
            setEmailError("Email incorrect format.")
            isValid = false;
          } else {
            setEmailError("");
          }
        }
        break;

      default:
        break;
    }
    return isValid;
  };

  const validateData2 = (name, value) => {
    // Create object containing the errors
    const errorMessages = {
      fullname: "Full Name is required.",
      username: "Username is required.",
      password: {
        empty: "Password is required.",
        inValid: "Encryption password must have atleast 8 characters."
      },
      email: {
        empty: "Email is required.",
        inValid: "Email incorrect format."
      }
    };
    // Create object containing the methods to update errors
    const setErrorFunctions = {
      fullname: setFullnameError,
      username: setUsernameError,
      password: setPasswordError,
      email: setEmailError,
    };
    const setErrorFunction = setErrorFunctions[name];

    if(!value){
      setErrorFunction(errorMessages[name].empty || errorMessages[name]);
      return false;
    }  
    if(name === "email" && !validateEmail(value)){
      setErrorFunction(errorMessages.email.inValid);
      return false;
    }
    if(name === "password" && value.length < 8){
      setErrorFunction(errorMessages.password.inValid);
      return false;
    }

    setErrorFunction("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
    validateData2(name, value)
  };

  const [user, setUser] = useState({
    fullname: "",
    username: "",
    password: "",
    email: "",
    status: 1,
    roles: ["user"]
  })


  return (
    <>
        <div className='flex justify-center items-center h-screen bg-gray-100'>
            <form onSubmit={handleSubmit} className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-[12px]'>
                <h3 className='text-center text-[20px] font-semibold uppercase'>Registration</h3>
                <div className='flex flex-col gap-2'>
                    <label>Full name &#42;</label>
                    <Input type='text' ref={inputRefFocus} placeholder='Please enter your Full name' onChange={handleChange} name='fullname' status={fullnameError ? "error":""}/>
                    {
                      fullnameError && (
                        <span className='error-message'>{fullnameError}</span>
                      )
                    }    
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Username &#42;</label>
                    <Input type='text' placeholder='Please enter your Username' onChange={handleChange} name='username' status={usernameError ? "error":""}/>
                    {
                      usernameError && (
                        <span className='error-message'>{usernameError}</span>
                      )
                    }
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='password'>Password &#42;</label>
                    <Input.Password placeholder='Please enter your Password' onChange={handleChange} name='password' status={passwordError ? "error":""}/>
                    {
                      passwordError && (
                        <span className='error-message'>{passwordError}</span>
                      )
                    }
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Email &#42;</label>
                    <Input type='text' placeholder='Please enter your Email' onChange={handleChange} name='email' status={emailError ? "error":""}/>
                    {
                      emailError && (
                        <span className='error-message'>{emailError}</span>
                      )
                    }
                </div>
                <div className='flex flex-col gap-2'>
                  <Button htmlType='submit' className='w-full' type='primary'>
                    Register
                  </Button>
                </div>
                <div className='text-center'>
                  <span>Already have an account?</span>
                  <Link to="/login" className="text-blue-600 hover:text-blue-500"> 
                    Login here
                  </Link>
                </div>
            </form>
        </div>

    </>
  )
}
