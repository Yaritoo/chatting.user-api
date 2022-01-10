const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../model/user');
const user = require('../model/user');

exports.user_getAll = async (req, res, next) => {
    try {
        let users = await User.find().exec();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

exports.user_getOne = async (req, res, next) => {
    try {
        let id = req.params.userId;
        let user = await User.findById(id).exec();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

exports.user_signup = async (req, res, next) => {
    try {
        let foundUser = await User.find({ userName: req.body.userName }).exec();
        if (foundUser.length > 0) {
            return res.status(409).json({
                message: 'Username existed'
            });
        }
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            userName: req.body.userName,
            password: req.body.password
        });
        await newUser.save();
        res.status(201).json({
            message: 'user created',
            newUser: newUser
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

exports.user_login = async (req, res, next) => {
    try {
        const foundUser = await User
            .find(
                {
                    userName: req.body.userName,
                    password: req.body.password
                })
            .exec();
        if (foundUser.length === 0) {
            res.status(404).json('User not found');
        }
        const token = jwt.sign(
            {
                email: foundUser[0].email,
                userId: foundUser[0]._id
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
        );
        res.setHeader('token', token);
        res.status(200).json(foundUser);
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}