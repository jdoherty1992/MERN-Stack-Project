import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useUpdateUser = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser, authUser } = useAuthContext();

    const updateUser = async ({ fullName, username, password, confirmPassword, gender }) => {
        const success = handleInputErrors({ fullName, username, password, confirmPassword });
        if (!success) return;

        // Prepare the data to send to the server
        const updatedData = {
            fullName,
            username,
            gender,
            password,
            confirmPassword,
        };

        // If password is provided, add it to the request body
        if (password) {
            updatedData.password = password;
        }

        console.log("Data to send:", updatedData); // Log the data being sent

        setLoading(true);
        try {
            const res = await fetch("/api/auth/update-profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            localStorage.setItem("chat-user", JSON.stringify(data));
            setAuthUser(data);
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, updateUser };
};

export default useUpdateUser;

function handleInputErrors({ fullName, username, password, confirmPassword }) {
    if (!fullName || !username || !password || !confirmPassword) {
        toast.error("Please fill in all fields");
        return false;
    }

    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword); // Log to verify both fields

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
    }

    return true;
}