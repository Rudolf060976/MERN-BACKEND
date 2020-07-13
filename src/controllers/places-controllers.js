const createError = require('http-errors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const crudOperations = require('../database/crud-operations');
const { ObjectID } = require('mongodb');


const getPlaceById = async (req, res, next) => {

    const { placeId } = req.params;

    try {
        
        const place = await crudOperations.Places.getPlaceById(placeId);

        res.status(200).json({
            error: null,
		    ok: true,
		    status: 200,
		    message: 'Sucess',
		    data: {
                place
            }
        });


    } catch (error) {
        
        next(error);

    }
        

};


const getPlacesByUserId =  async (req, res, next) => {

    const { userId } = req.params;

    try {
        
        const places = await crudOperations.Places.getPlacesByUserId(userId);

        res.status(200).json({
            error: null,
		    ok: true,
		    status: 200,
		    message: 'Sucess',
		    data: {
                places
            }
        });

    } catch (error) {
        
        next(error);

    }
   
};


const postCreatePlace = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {

        return next(createError(422, 'BAD REQUEST')); // USAMOS next(err) PORQUE ESTAMOS EN CODIGO ASINCRONO

    }

    const { title, description, address } = req.body;

    let session = null;

    try {

        const creator = req.user.id; // EL id DEL USUARIO ES COLOCADO POR auth.checkIsAuthenticated Middleware
        
        placeData = {
            title,
            description,
            address,
            creator, 
            image: req.file.path
        };        

        session = await mongoose.startSession();

        session.startTransaction();
               
        

        const user = await crudOperations.Users.getUserbyId(creator);

        

        if(!user) {

            throw createError(404, 'Could not find the Creator!');

        }

        

        const newPlace = await crudOperations.Places.addNewPlace(placeData, session);


        await crudOperations.Users.addPlacetoUser(creator, newPlace, session);


        await session.commitTransaction();

        res.status(201).json({
            error: null,
		    ok: true,
		    status: 201,
		    message: 'Place Created Successfully',
		    data: {
                place: newPlace
            }
        });


    } catch (error) {
        
        session.abortTransaction();

        next(error);

    }
    
   

};


const patchUpdatePlace = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {

        return next(createError(422, 'BAD REQUEST'));
    }

    const { placeId } = req.params;

    const { title, description } = req.body;

   
    try {

        const authenticatedUserId = req.user.id;
        
        const updatedPlace = await  crudOperations.Places.updatePlace(placeId, authenticatedUserId, { title, description });

        res.status(200).json({
            error: null,
		    ok: true,
		    status: 200,
		    message: 'Place Updated Successfully',
		    data: {
                place: updatedPlace
            }
        });

    } catch (error) {
        
        next(error);

    }


};

const deleteDeletePlace = async (req, res, next) => {

    const { placeId } = req.params;

    let session = null;

    try {

        session = await mongoose.startSession();

        session.startTransaction();

        const authenticatedUserId = req.user.id;
        

        await crudOperations.Users.deletePlaceFromUser(placeId, session);
               
        const deletedPlace = await crudOperations.Places.deletePlace(placeId, authenticatedUserId, session);

        await session.commitTransaction();

        res.status(200).json({
            error: null,
		    ok: true,
		    status: 200,
		    message: 'Place Deleted Successfully',
		    data: {
                place: deletedPlace
            }
        });


    } catch (error) {

        session.abortTransaction();
        
        next(error);

    }
};



module.exports ={
    getPlaceById,
    getPlacesByUserId,
    postCreatePlace,
    patchUpdatePlace, 
    deleteDeletePlace
};