const Position = require('../models/Position');
const errorHandler = require('../utils/erroHandler');

module.exports.getByCategoryId = async (req, res) => {
    try {
        const positions = await Position.find({
            category: req.params.categoryId,
            user: req.user.id
        });
        await res.status(200).json(positions);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.create = async (req, res) => {
    try {
        const position = await new Position({...req.body, user: req.user.id}).save();
        await res.status(201).json(position);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.remove = async (req, res) => {
    try {
        await Position.deleteOne({_id: req.params.id});
        await res.status(200).json({message: 'Position was successfully removed'});
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.update = async (req, res) => {
    try {
        const position = await Position.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true});
        await res.status(200).json(position);
    } catch (e) {
        errorHandler(res, e);
    }
}
