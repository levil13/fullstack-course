const express = require('express');
const passport = require('passport');
const upload = require('../middleware/upload');
const controller = require('../controllers/category');
const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}, null), controller.getAll);
router.post('/', passport.authenticate('jwt', {session: false}, null), upload.single('image'), controller.create);
router.get('/:id', passport.authenticate('jwt', {session: false}, null), controller.getById);
router.patch('/:id', passport.authenticate('jwt', {session: false}, null), upload.single('image'), controller.update);
router.delete('/:id', passport.authenticate('jwt', {session: false}, null), controller.remove);

module.exports = router;
