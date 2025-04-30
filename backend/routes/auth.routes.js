import express from "express";
import { deleteProfile, login, logout, profile, signup, updateProfile } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";


const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/profile", protectRoute, profile);

router.put("/update-profile", protectRoute, updateProfile);

router.delete("/delete-profile", protectRoute, deleteProfile);

export default router;