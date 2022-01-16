const express = require('express');
const router = express.Router();

const User = require('../model/user');
const UserController = require('../controller/user');
const checkAuth = require('../middleware/check-auth');

router.get('/', UserController.user_getAll);

router.get('/:userId', UserController.user_getOne);

router.get('/users/filter', UserController.user_getFilterById);

router.post('/login', UserController.user_login);

router.post('/signup', UserController.user_signup);

router.put('/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateUser = new User();
    for (const key of Object.keys(req.body)) {
        updateUser[key] = req.body[key];
    }
    User
        .updateOne({ _id: id }, { $set: updateUser })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
})

module.exports = router;