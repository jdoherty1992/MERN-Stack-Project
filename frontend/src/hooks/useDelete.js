import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const useDeleteProfile = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();
    const navigate = useNavigate();

    const deleteProfile = async () => {
        setLoading(true);
    
        try {
            const response = await axios.delete('/api/auth/delete-profile', {
                withCredentials: true,
            });
    
            if (response.status === 200) {
                toast.success("Profile deleted successfully! Redirecting to Home...");
                setAuthUser(null);
                localStorage.removeItem('token');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                toast.error("Something went wrong while deleting the profile.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while deleting the profile.");
        } finally {
            setLoading(false);
        }
    };
    return { deleteProfile, loading };
    };

export default useDeleteProfile;