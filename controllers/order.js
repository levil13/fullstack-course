const Order = require('../models/Order');
const errorHandler = require('../utils/erroHandler');

module.exports.getAll = async (req, res) => {
    const query = {
        user: req.user.id,
    };
    if (req.query?.start || req.query?.end) {
        query.date = {};
        if (req.query?.start) {
            query.date['$gte'] = req.query.start
        }
        if (req.query?.end) {
            query.date['$lte'] = req.query.end
        }
    }

    if (req.query?.order) {
        query.order = +req.query.order;
    }

    try {
        const orders = await Order
            .find(query)
            .sort({date: -1})
            .skip(+req.query.offset)
            .limit(+req.query.limit);
        await res.status(200).json(orders);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.create = async (req, res) => {
    try {
        const lastOrder = await Order
            .findOne({user: req.user.id})
            .sort({date: -1});

        const maxOrder = lastOrder?.order || 0;

        const order = new Order({
            list: req.body.list,
            user: req.user.id,
            order: maxOrder + 1
        });

        await order.save();
        await res.status(201).json(order);
    } catch (e) {
        errorHandler(res, e);
    }
}
