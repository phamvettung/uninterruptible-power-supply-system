import { Alert, Button, Input, notification } from 'antd'
import React, { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, verifyToken } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { ROLE_ADMIN } from '../../redux/constants/role';

export default function Login() {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const inputRefFocus = useRef();
  useEffect(() => {
  if(inputRefFocus){
    inputRefFocus.current.focus();
  }
  }, []);

  const hasShown = useRef(false);
  useEffect(() => {
    if (!hasShown.current) {
      notification.warning({
        message: "Warning",
        description: "You are not logged in. Please! login now."
      });
      hasShown.current = true;
    }
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isUsernameValid = validateData("username", user.username);
    const isPasswordValid = validateData("password", user.password)

    if (isUsernameValid && isPasswordValid){

      try{
        const resultAction = await dispatch(login(user));   
        const originalPromiseResult = unwrapResult(resultAction); //throws if rejected  

        if (originalPromiseResult){
          //Get user info
          const resultVerify = await verifyToken(originalPromiseResult.data.accessToken);
          //Check roles
          if(resultVerify.data.roles.some(item => item.roleName === ROLE_ADMIN)){
            navigate('/', { state: { user: resultVerify.data } } ); // navigate and send data
          } else {
            navigate('/', { state: { user: resultVerify.data } } );
          }
          notification.success({
                      message: "Success " + resultVerify.code,
                      description: "Hi, " + resultVerify.data.fullname
          })
        }

      } catch (error){    
        console.log("Thunk error object:", error);
        setErrorServer(error.msg);
        notification.error({
          message: "Error " + error.code,
          description: error.msg
        });

      } finally {

      }
    }

  }

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorServer, setErrorServer] = useState(false);

  const validateData = (name, value) => {
    let isValid = true;
    switch(name){
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

      default:
        break;
    }
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
    validateData(name, value)
  };

  const [user, setUser] = useState({
    username: "",
    password: "",
  })

  return (
    <>
      <div className='flex justify-center items-center h-screen bg-gray-100'>
          <form onSubmit={handleSubmit} className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-[12px]'>

              <header>
                <h3 className='text-center text-[20px] font-semibold uppercase'>Sign in to your account</h3>
              </header>

              <main>
                <div className='flex flex-col gap-2'>
                  <label>Username</label>
                  <Input type='text' ref={inputRefFocus} placeholder='Please enter your username' onChange={handleChange} name='username' status={usernameError ? "error":""}/>
                  {
                    usernameError && (
                      <span className='error-message'>{usernameError}</span>
                    )
                  }
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Password</label>
                    <Input.Password placeholder='Please enter your password' onChange={handleChange} name='password' status={passwordError ? "error":""}/>
                    {
                      passwordError && (
                        <span className='error-message'>{passwordError}</span>
                      )
                    }
                </div>                
              </main>

              <footer>
                {
                  errorServer && (
                    <Alert style={{ marginBottom: "3px" }} type='error' message={errorServer} />
                  )
                }

                <div className='flex flex-col gap-2'>
                  <Button htmlType='submit' className='w-full' type='primary'>
                    Login
                  </Button>
                </div>
                <div className='text-center'>
                  <span>Don't have an account?</span>
                  <Link to="/register" className="text-blue-600 hover:text-blue-500"> 
                    Click here to register
                  </Link>
                </div>
              </footer>
              
          </form>
      </div>
    </>
  )
}
