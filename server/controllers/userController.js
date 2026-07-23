import { generateToken } from "../lib/utils.js";
import { prisma } from "../lib/db.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"

// Signup a new user
export const signup = async (req, res)=>{
    const { fullName, email, password, bio, phoneNumber, username } = req.body;

    try {
        if (!fullName || !email || !password || !bio || !username){
            return res.json({success: false, message: "Missing Details" })
        }
        
        // Check email
        const userByEmail = await prisma.user.findUnique({ where: { email } });
        if(userByEmail){
            return res.json({success: false, message: "Account already exists" })
        }

        // Check username
        const userByUsername = await prisma.user.findUnique({ where: { username } });
        if(userByUsername){
            return res.json({success: false, message: "Username is already taken" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: { fullName, email, password: hashedPassword, bio, phoneNumber, username }
        });

        const token = generateToken(newUser.id)

        res.json({success: true, userData: newUser, token, message: "Account created successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Controller to login a user
export const login = async (req, res) =>{
    try {
        const { email, password } = req.body;
        const userData = await prisma.user.findUnique({ where: { email } });
        
        if (!userData) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect){
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData.id)

        res.json({success: true, userData, token, message: "Login successful"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Controller to check if user is authenticated
export const checkAuth = (req, res)=>{
    res.json({success: true, user: req.user});
}

// Controller to update user profile details
export const updateProfile = async (req, res)=>{
    try {
        const { profilePic, bio, fullName, phoneNumber } = req.body;

        const userId = req.user.id;
        let updatedUser;

        if(!profilePic){
            updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { bio, fullName, phoneNumber }
            });
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { profilePic: upload.secure_url, bio, fullName, phoneNumber }
            });
        }
        res.json({success: true, user: updatedUser})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}