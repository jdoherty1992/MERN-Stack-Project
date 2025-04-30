import React from 'react'
import {BiLogOut} from 'react-icons/bi';
import {VscAccount} from 'react-icons/vsc'
import useLogout from '../../hooks/useLogout';
import { Link } from 'react-router-dom';
const LogoutButton = () => {

  const {loading, logout}= useLogout();

  return ( 
    <div className='mt-auto flex justify-between items-center w-full px-1'>
        {!loading ? (
          <BiLogOut className="w-6 h-6 text-white cursor-pointer hover:text-green-300" onClick={logout} />
        ) : (
          <span className= 'loading loading-spinner'></span>
        )}
        <Link to="/profile">
          <VscAccount className="w-6 h-6 text-white cursor-pointer hover:text-green-300"/>
        </Link>
    </div>
    );
};
export default LogoutButton;