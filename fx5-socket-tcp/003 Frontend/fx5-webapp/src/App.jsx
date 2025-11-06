import React from "react";
import { Route, Routes, Navigate  } from "react-router-dom";
import Login from "./views/login";
import Register from "./views/register";
import Home from "./views/home";
import Dashboard from "./views/admin";

export default function App() {
  return <>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/admin" element={<Dashboard />}/>
    </Routes>
  </>
}