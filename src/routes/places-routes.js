const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const placesControllers = require('../controllers/places-controllers');

const fileUpload = require('../middleware/file-upload');

const auth = require('../middleware/auth');


router.get('/:placeId', placesControllers.getPlaceById);


router.get('/user/:userId', placesControllers.getPlacesByUserId );


router.post('/',
auth.checkIsAuthenticated(),
fileUpload.single('image'),
[
    body('title').notEmpty().withMessage('must have a title'),
    body('description').isLength({ min: 5 }).withMessage('description must be at least 5 chars'),
    body('address').notEmpty(),
    body('creator').notEmpty()
],
placesControllers.postCreatePlace);



router.patch('/:placeId',
auth.checkIsAuthenticated(),
[
    body('title').notEmpty(),
    body('description').isLength({ min: 5 })
],
placesControllers.patchUpdatePlace);

router.delete('/:placeId', auth.checkIsAuthenticated(), placesControllers.deleteDeletePlace);



module.exports = router;