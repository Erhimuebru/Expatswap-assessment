import React from 'react';
import { FaPowerOff } from "react-icons/fa";
import { NavLink, useLocation } from 'react-router-dom';
import {  FaHome } from "react-icons/fa";
import { HiMiniUserGroup } from "react-icons/hi2";
const Navbar = () => {

    const location = useLocation();

  return (
    <>

<div className="relative top-0 w-full h-24 flex justify-between items-center bg-white shadow text-black">
        
<ul className="flex flex-grow gap-12 mt-2 items-center justify-center">

<li>
                        <NavLink to='/'     className={`items-center inline-block cursor-pointer ${
                             location.pathname === '/' ? 'text-blue-500 bg-[#f1f7fe] p-1 rounded-lg' : ''
                                        }`}>
                           <div className="items-center ml-2 mr-2 mt-2 mb-2 cursor-pointer">
                                <FaHome className="ml-3 text-2xl" />
                            Home
                            </div>
                        </NavLink>
                    </li>
                    
       {/* <Link to="/users">  <li className='font-bold text-xl'>Users</li></Link> */}


       <li>
                        <NavLink to='/users'     className={`items-center inline-block cursor-pointer ${
                             location.pathname === '/users' ? 'text-blue-500 bg-[#f1f7fe] p-1 rounded-lg' : ''
                                        }`}>
                           <div className="items-center m-2 cursor-pointer">
                                <HiMiniUserGroup className="ml-3 text-2xl" />
                            Users
                            </div>
                        </NavLink>
                    </li>
                    
      </ul>
        </div>

    </>
  );
};

export default Navbar;
