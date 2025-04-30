import React, { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { VscArrowCircleLeft } from 'react-icons/vsc';
import GenderCheckbox from '../signup/GenderCheckbox';
import useUpdateUser from '../../hooks/useUpdateUser';
import useDeleteProfile from '../../hooks/useDelete';
import toast from 'react-hot-toast';

const UpdateProfile = () => {

    const [inputs, setInputs] = useState({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
        gender: ''
      });

    const {loading, updateUser} = useUpdateUser();
    const {authUser, setAuthUser} = useAuthContext();
    const { deleteProfile, loading: deleteLoading } = useDeleteProfile();

    const handleCheckboxChange = (gender) => {
      setInputs({...inputs, gender})
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      console.log("Submitting profile update with:", inputs); // Log the inputs to check the password fields  
      await updateUser(inputs);
    };

    const confirmDeleteToast = () => {
      toast.custom((t) => (
        <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg shadow-md flex flex-col items-center gap-3 w-72">
          <p className="text-center">Are you sure you want to delete your profile?</p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                toast.dismiss(t.id);         // Immediately dismiss the confirmation box
                deleteProfile();              // Call deleteProfile without awaiting here
              }}
              className="bg-green-300 hover:bg-green-200 text-black px-3 py-1 rounded"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ));
    };
  
    return (
        <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
          <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
            <img
              src={authUser?.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h1 className="text-3xl font-semibold text-center text-gray-200">
              Update <span className="text-green-300">{authUser.fullName}</span>
            </h1>

            <form onSubmit={handleSubmit}>
              <div>
                <label className='label p-2'>
                  <span className='text-base label-text'>Full Name</span>
                </label>
                <input type='text' placeholder={authUser.fullName} className='w-full input input-bordered h-10'
                  value={inputs.fullName}
                  onChange={(e) => setInputs({...inputs, fullName: e.target.value})}
              />
              </div>
              <div>
                <label className='label p-2'>
                  <span className='text-base label-text'>Username</span>
                </label>
                <input type='text' placeholder={authUser.username} className='w-full input input-bordered h-10' 
                  value ={inputs.username}
                  onChange={(e) => setInputs({...inputs, username: e.target.value})}  
                />
              </div>
              <div>
                <label className='label'>
                  <span className='text-base label-text'>Password</span>
                </label>
                <input
                  type='password'
                  placeholder='Enter Password'
                  className='w-full input input-bordered h-10'
                  value={inputs.password}
                  onChange={(e) => setInputs({...inputs, password: e.target.value})}
                />
              </div>
              <div>
                <label className='label'>
                  <span className= 'text-base label-text'>Confirm Password</span>
                </label>
                <input
                  type='password'
                  placeholder='Confirm Password'
                  className='w-full input input-bordered h-10'
                  value={inputs.confirmPassword}
                  onChange={(e) => setInputs({...inputs, confirmPassword: e.target.value})}
                />
              </div>
              <GenderCheckbox onCheckboxChange = {handleCheckboxChange} selectedGender={inputs.gender} />

                <button type="submit" 
                  className="btn btn-block btn-cm mt-4 border border-slate-700" 
                  disabled={loading}
                  > 
                  {loading ? <span className = "loading loading-spinner"></span> :"Update Profile"} 
                </button>

                <button type="button" onClick={confirmDeleteToast}
                  className="btn btn-block btn-cm mt-4 border border-slate-700"
                  disabled={deleteLoading} // Use deleteLoading from the custom hook to disable the button while loading
                >
                  {deleteLoading ? <span className="loading loading-spinner"></span> : "Delete Profile"}
                </button>

              <Link to="/profile">
                <VscArrowCircleLeft className="w-8 h-8 text-white cursor-pointer hover:text-green-300 mt-2"/>
              </Link>
              </form>
            </div>
          </div>
      );
    };

export default UpdateProfile;
