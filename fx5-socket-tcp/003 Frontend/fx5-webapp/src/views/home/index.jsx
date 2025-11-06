import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IDLE } from '../../redux/constants/status'
import { useLocation, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import DefaultLayout from '../../layouts/DefaultLayout';
import Cookies from 'js-cookie';
import { loadUserFromCookie } from '../../services/authService';
import { getAllUsers } from '../../services/userService';

export default function Home() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  //get auth from redux
  const data = useSelector((state) => state.auth)
  //get user from location
  const user = location.state?.user;

  useEffect(()=>{
    const token = Cookies.get("access_token") ? JSON.parse(Cookies.get("access_token")) : null;
    if (token) {
      dispatch(loadUserFromCookie(token));
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    // Only redirect if status is idle and there's no token
    const token = Cookies.get("access_token") ? JSON.parse(Cookies.get("access_token")) : null;
    if (!token && data.status === IDLE) {
      navigate('/login')
    }
  }, [data, navigate]); 



  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div>
      <DefaultLayout user={user ? user : null} />
    </div>
  )
}
