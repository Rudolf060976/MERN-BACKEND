const createError = require('http-errors');
const Models = require('../models');
const { ObjectID } = require('mongodb');
const bcrypt  = require('bcryptjs');



const addNewUser = async (userData) => {

    try {
        
        const { name, email, password, image } = userData;

        const existingUser = await Models.User.findOne({ email });

        if(existingUser) {

            throw createError(409, 'email already exists!');

        }

        const newUser = Models.User.create({
            _id: new ObjectID(),
            name,
            email,
            password,
            image,
            places: []
        });

        return newUser;

    } catch (error) {
        
        throw createError(error.status || 500, error.message);

    }

};


const loginUser = async (email, password) => {

    try {
        
        const user = await Models.User.findOne({ email });

        if(!user) {

            throw createError(404, 'Email Not Found!');

        }

        if(!bcrypt.compareSync(password, user.password)) {

            throw createError(403, 'Incorrect Password!');

        }

        return user;

    } catch (error) {
        
        throw createError(error.status || 500, error.message);

    }

};

const getAllUsers = async () => {

    try {
        
        const users = await Models.User.find({});

        return users;

    } catch (error) {
        
        throw createError(error.status || 500, error.message);

    }

};

const addPlacetoUser = async (userId, placeDoc, session) => {

    try {
        
        const user = await Models.User.findById(userId).session(session);

        if(!user) {

            throw createError(404, 'Could not find the User!');

        }
        
        const existentPlace = user.places.find(id => {

           return id.toHexString() === placeDoc._id.toHexString();

        });

        if(!existentPlace) {

            user.places.push(placeDoc);      

            await user.save();

        }   


    } catch (error) {
        
        throw createError(error.status || 500, error.message);

    }

};

const getUserbyId = async (userId) => {


    try {
        
        const user = await Models.User.findById(userId);

        if(!user) {

            return null;

        }
        
                
        return true;       


    } catch (error) {
        
        throw createError(error.status || 500, error.message);

    }


};

const deletePlaceFromUser = async (placeId, session) => {

    try {

        if(!ObjectID.isValid(placeId)) {

            throw createError(400, 'Place Id is not valid');

        }
       
        const place = await Models.Place.findById(placeId);

        if(!place) {

            throw createError(404, 'Place Id Not Found');

        }

        const userId = place.creator;

        const user = await Models.User.findById(userId).session(session);

        if(!user) {

            throw createError(404, 'Place without valid Creator');

        }
/*
        const newPlaces = user.places.filter(id => {

            return id.toHexString() !== placeId;

        });

        user.places = newPlaces;

        */

        user.places.pull(place);

        await user.save();


    } catch (error) {
        
        throw createError(error.status || 500, error.message);

    }

};


module.exports = {
    addNewUser,
    loginUser,
    getAllUsers,
    addPlacetoUser,
    getUserbyId,
    deletePlaceFromUser
};


