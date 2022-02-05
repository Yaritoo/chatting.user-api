const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../model/user');
const server = require('../../server');

exports.user_getAll = async (req, res, next) => {
    try {
        let users = await User.find().exec();
        let result = users.map(u => {
            return {
                id: u.id,
                userName: u.userName
            }
        });
        res.status(200).json(result);
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
        let result = {
            id: user.id,
            userName: user.userName
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

exports.user_getFilterById = async (req, res, next) => {
    try {
        var ids = req.query.ids;
        let name = req.query.name;
        let users;
        if (ids && !name) {
            ids = ids.split(',');
            await ids.forEach((value, index) => {
                ids[index] = mongoose.Types.ObjectId.isValid(value) ? value : null;
            });
            users = await User.find({ _id: { $in: ids } });
        }
        if (name && !ids)
            users = await User.find({ userName: { $regex: `${name}` } });
        let result = users.map(u => {
            return {
                id: u.id,
                userName: u.userName
            }
        });
        res.status(200).json(result);
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
        server.sendMessage(newUser); // send to redis of message
        await newUser.save();
        let result = {
            id: newUser.id,
            userName: newUser.userName
        }
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

exports.user_login = async (req, res, next) => {
    try {
        const foundUsers = await User
            .find(
                {
                    userName: req.body.userName,
                    password: req.body.password
                })
            .exec();
        if (foundUsers.length === 0) {
            res.status(404).json('User not found');
        }
        const token = jwt.sign(
            {
                email: foundUsers[0].email,
                id: foundUsers[0].id,
                userName: foundUsers[0].userName
            },
            'helloworld',
            {
                expiresIn: "1h"
            }
        );

        let result = {
            id: foundUsers[0].id,
            userName: foundUsers[0].userName
        };

        await server.sendMessage(result); // send to kafka

        res.setHeader('token', token);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}
