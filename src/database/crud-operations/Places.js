const createError = require('http-errors');
const fs = require('fs');
const Models = require('../models');
const { ObjectID } = require('mongodb');
const getCoordsForAddress = require('../../util/location');

const addNewPlace = async (placeData, session) => {

    const { title, description, address, creator, image } = placeData;
    
    try {
        
        let coordinates = null;
        
        coordinates = await getCoordsForAddress(address);
        

        const newDoc = await Models.Place.create([{
            _id: new ObjectID(),
            title,
            description,
            image:' ',
            address,
            location: coordinates,
            creator: ObjectID.createFromHexString(creator),
            image
        }], { session: session });
       
        return newDoc[0];


    } catch (error) {
        

        throw createError(500, error.message);

    }


};


const getPlaceById = async placeId => {

    
    try {
        
        const place = await Models.Place.findById(placeId);

        if(!place) {

            throw createError(404, 'Id Not Found');
        }

        return place;

    } catch (error) {
        
        throw createError(500, error.message);

    }


};


const getPlacesByUserId = async userId => {


    try {
        
        const places = await Models.Place.find({ creator: userId.toString()});

        return places;

    } catch (error) {
        
        throw createError(500, error.message);

    }

};

const updatePlace = async (placeId, authenticatedUserId, placeData) => {

  
    try {
        
        const { title, description } = placeData;  

        if(!ObjectID.isValid(placeId)) {
            throw createError('400', 'Invalid Place Id');
        }
        
        const place = await Models.Place.findById(placeId);

        if(!place) {
            throw createError(404, 'Place Id Not Found');
        }

        // ANTES DE ACTUALIZAR EL PLACE, HAY QUE VERIFICAR SI EL USUARIO AUTENTICADO ES EL CREADOR DEL PLACE

        if(place.creator.toString() !== authenticatedUserId.toString()) {

            throw createError(401, 'Your are not allowed to edit this place' )

        }

        const updatedPlace = await Models.Place.findByIdAndUpdate(placeId,{ title, description },{ new: true });

        return updatedPlace;

    } catch (error) {
        
        throw createError(error.status || 500, error.message);

    }

};

const deletePlace = async (placeId, authenticatedUserId, session) => {

    
    try {

        if(!ObjectID.isValid(placeId)) {

            throw createError(400, 'Id is not valid');

        }

        const existentPlace = await Models.Place.findById(placeId);

        if(!existentPlace) {

            throw createError(404, 'Place Id Not Found');

        }

         // ANTES DE ACTUALIZAR EL PLACE, HAY QUE VERIFICAR SI EL USUARIO AUTENTICADO ES EL CREADOR DEL PLACE

         if(existentPlace.creator.toString() !== authenticatedUserId.toString()) {

            throw createError(401, 'Your are not allowed to delete this place' )

        }

        const placeImagePath = existentPlace.image;

        const deletedPlace = await Models.Place.findByIdAndDelete(placeId).session(session);

        
        fs.unlink(placeImagePath, error => { // AL ELIMINAR UN PLACE, HAY QUE ELIMINAR EL ARCHIVO DE IMAGEN EN EL SERVIDOR.

            console.log(error);

        });


        return deletedPlace;
        
    } catch (error) {
        
        throw createError(error.status || 500, error.message);

    }
    
};

module.exports = {
    addNewPlace,
    getPlaceById,
    getPlacesByUserId,
    updatePlace,
    deletePlace
};