import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import './App.css'
import SignUp from './pages/signup/signup';
import Users from './pages/users/users';
import Footer from './components/footer/footer';
import SubNav from './components/subNav/subNav';
import Navbar from './components/navbar/navbar';



function App() {


  return (
    <>
    <SubNav/>
    <Navbar/>

     <Routes>
               <Route path="/" element={<SignUp/>}/> 
               <Route path="/users" element={<Users/>}/> 

             
       </Routes>
<Footer/>
    </>
  )
}

export default App
