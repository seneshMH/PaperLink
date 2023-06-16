import bcrypt from 'bcryptjs';
import  jwt  from 'jsonwebtoken';
import User from '../models/user.model.js';

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

        //save user
        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            success: true,
            message: "User created successfully"
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
        const user = await User.findOne({ email: req.body.email });
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
        const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY, { expiresIn: "1d" });

        res.send({
            success: true,
            message: "User loged in successfully",
            data: token
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
        const user = await User.findById(req.body.userId);
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
        const users = await User.find();
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
        await User.findByIdAndUpdate(req.params.id, req.body);

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
