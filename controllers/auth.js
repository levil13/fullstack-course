const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/User');
const errorHandler = require('../utils/erroHandler');

module.exports.login = async (req, res) => {
    const existingUser = await User.findOne({email: req.body.email});

    if (!existingUser) {
        await res.status(404).json({message: 'There is no user with such email'});
        return;
    }

    const passwordResult = bcrypt.compareSync(req.body.password, existingUser.password);

    if (!passwordResult) {
        await res.status(401).json({message: 'Wrong password. Please try again'});
        return;
    }

    const token = jwt.sign({
        email: existingUser.email,
        userId: existingUser._id
    }, keys.jwt, {expiresIn: 60 * 60});

    await res.status(200).json(`Bearer ${token}`);
}

module.exports.register = async (req, res) => {
    const email = req.body.email;
    const existingUser = await User.findOne({email});

    if (existingUser) {
        await res.status(409).json({message: 'User with current email already exists'});
        return;
    }

    const user = new User({email, password: encryptPassword(req.body.password)});

    user.save()
        .then(response => res.status(201).json(response))
        .catch(error => errorHandler(res, error));
}

const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}
