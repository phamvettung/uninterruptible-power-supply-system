import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie';
import { loadUserFromCookie } from '../../services/authService';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';

export default function DashBoard() {

  const data = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(()=>{
    const token = JSON.parse(Cookies.get("token"));
    dispatch(loadUserFromCookie(token));
  }, []);


  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <div>
        <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}
