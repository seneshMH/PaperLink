import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import cloudinary from "../config/cloudinary.config.js";

//register user
export const register = async (req, res) => {
    try {

        //check user already exists
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            throw new Error('User already exists');
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPasword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPasword;


        //create user
        const newUser = new User(req.body);
        await newUser.save();

        //send response
        res.send({
            success: true,
            message: "User created successfully",
            data: newUser
        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//upload profile picture to cloudinary
export const uploadProfilePicture = async (req, res) => {
    try {

        //upload profile picture to cloudinary
        const profilePicture = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "profile-pictures",
            width: 150,
            height: 150,
            crop: "fill"
        });

        //update user profile picture
        const userId = req.body.user;
        await User.findByIdAndUpdate(userId, { profilePicture: profilePicture.secure_url });


        //send response
        res.send({
            success: true,
            message: "Profile picture uploaded successfully",
            data: profilePicture.secure_url
        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};


//login user
export const login = async (req, res) => {
    try {
        //check user exists
        const user = await User.findOne({ email: req.body.email }).select("+password");
        if (!user) {
            throw new Error('User not found');
        }

        //check if user is active
        if (user.status !== "active") {
            throw new Error("User Account is blocked, please contact admin");
        }

        //compare password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            throw new Error('User not found');
        }

        //create and assign token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: "1d" });

        //send response
        res.send({
            success: true,
            message: "User loged in successfully",
            token: token,
        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//get current user
export const getCurrentUser = async (req, res) => {
    try {
        //find user by id
        const user = await User.findById(req.body.userId);

        user.password = undefined;

        //send response
        res.send({
            success: true,
            message: "User fetched successfully",
            data: user
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//get all users
export const getAllUsers = async (req, res) => {
    try {
        //find all users
        const users = await User.find();

        //send response
        res.send({
            success: true,
            message: "Users fetched successfully",
            data: users
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//update user status
export const updateUserStatus = async (req, res) => {
    try {
        //update user status by id
        await User.findByIdAndUpdate(req.params.id, req.body);

        //send response
        res.send({
            success: true,
            message: "User status updated successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//get user by id
export const getUserById = async (req, res) => {
    try {
        //find user by id
        const user = await User.findById(req.params.id);

        //send response
        res.send({
            success: true,
            message: "User fetched successfully",
            data: user
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//give rating to user
export const giveRating = async (req, res) => {
    try {
        const { rating } = req.body;

        if (!rating) {
            throw new Error("Rating is required");
        }

        if (rating > 5 || rating < 1) {
            throw new Error("Rating must be between 1 to 5");
        }

        if (!req.params.id) {
            throw new Error("User not found");
        }

        //find user by id
        const user = await User.findById(req.params.id);

        // Calculate the updated rating
        const currentRating = user.rating || 0; // Default to 0 if there are no previous ratings
        const totalRatings = user.totalRatings || 0; // Default to 0 if there are no previous ratings
        const updatedTotalRatings = totalRatings + 1; // Increment the total number of ratings
        const updatedRating = (currentRating * totalRatings + rating) / updatedTotalRatings;


        //update user rating
        user.rating = updatedRating;
        user.totalRatings = updatedTotalRatings;

        //save user
        await user.save();

        //send response
        res.send({
            success: true,
            message: "User rating updated successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};
