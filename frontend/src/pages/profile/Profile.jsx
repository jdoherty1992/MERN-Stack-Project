import React from 'react'
import { useAuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { VscArrowCircleLeft } from 'react-icons/vsc';

const Profile = () => {
    const {authUser} = useAuthContext
    ();
    return (
        <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
          <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
            <img
              src={authUser?.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h1 className="text-3xl font-semibold text-center text-gray-200">
              Hello <span className="text-green-300">{authUser.fullName}</span>
            </h1>

            <Link to="/update-profile"> 
                <button className="btn btn-block btn-cm mt-4 border border-slate-700"> Edit Profile </button>
            </Link>
            <Link to="/">
                <VscArrowCircleLeft className="w-8 h-8 text-white cursor-pointer hover:text-green-300 mt-2"/>
            </Link>
          </div>
        </div>
      );
    };

export default Profile