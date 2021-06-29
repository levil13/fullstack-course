const Category = require('../models/Category');
const Position = require('../models/Position');
const errorHandler = require('../utils/erroHandler');

module.exports.getAll = async (req, res) => {
    try {
        const categories = await Category.find({user: req.user.id});
        await res.status(200).json(categories);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.getById = async (req, res) => {
    try {
        const categories = await Category.findById({_id: req.params.id});
        await res.status(200).json(categories);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.remove = async (req, res) => {
    try {
        await Category.remove({_id: req.params.id});
        await Position.remove({category: req.params.id});
        await res.status(200).json({message: 'Category was successfully removed'});
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.create = async (req, res) => {
    const category = new Category({
        name: req.body.name,
        user: req.user.id,
        imageSrc: req.file?.path
    })
    try {
        await category.save();
        await res.status(201).json(category);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.update = async (req, res) => {
    const updated = req.body;
    if (req.file) {
        updated.imageSrc = req.file.path;
    }
    try {
        const category = await Category.findOneAndUpdate({_id: req.params.id}, {$set: updated}, {new: true});
        await res.status(200).json(category);
    } catch (e) {
        errorHandler(res, e);
    }
}
