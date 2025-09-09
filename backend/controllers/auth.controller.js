import bcrypt from "bcryptjs"; 
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({error:"Passwords don't match"})
        }

        const user = await User.findOne({username});

        if (user) {
            return res.status(400).json({error:"Username already exists"})
        }

        // HASH PASSWORD HERE
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // https:avatar-placeholder.iran.liara.run/

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({ error: "Invalid user data"});
        }

    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
};

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        console.log("Login request body:", req.body);
        const user = await User.findOne({username});
        console.log("User found:", user);
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        console.log("Is password correct:", isPasswordCorrect);

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid username or password"});
        }

        // Debug log for JWT_SECRET
        console.log("JWT_SECRET:", process.env.JWT_SECRET);

        try {
            generateTokenAndSetCookie(user._id, res);
        } catch (tokenError) {
            console.log("Error generating token:", tokenError);
            return res.status(500).json({error: "Token generation failed"});
        }

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });

    }   catch (error) {
            console.log("Error in login controller", error);
            res.status(500).json({error: "Internal Server Error"});
        }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message);
            res.status(500).json({error: "Internal Server Error"});
    }
};

export const profile = async(req, res) => {};

export const updateProfile = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        
        // Ensure the user is logged in (the protectRoute middleware should set req.user)
        const userId = req.user._id;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // If username is being changed, make sure it's unique
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: "Username already taken" });
            }
            user.username = username;
        }

        // Update the fields if provided
        if (fullName) user.fullName = fullName;
        if (gender) user.gender = gender;

        // Handle password update if provided
        if (password && password === confirmPassword) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        } else if (password && password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Update profile picture based on gender
        if (gender) {
            const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${user.username}`;
            const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${user.username}`;
            user.profilePic = gender === "male" ? boyProfilePic : girlProfilePic;
        }

        // Save the updated user
        await user.save();

        // Respond with updated user data
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
        
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const user = req.user;
        console.log('Deleting user:', user);  // Add this line for debugging

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        await User.findByIdAndDelete(user._id);  // Delete user from DB
        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        console.error('Error deleting profile:', error.message);  // Add more error logging
        res.status(500).json({ error: "Internal Server Error" });
    }
};