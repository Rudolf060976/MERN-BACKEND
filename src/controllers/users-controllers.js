const { v4: uuidv4 } = require('uuid');
const createError = require('http-errors');
const { validationResult } = require('express-validator');
const crudOperations = require('../database/crud-operations');
const jwt = require('../util/JWT/userTokens');


const getUsers = async (req, res, next) => {

    try {
        
        const users = await crudOperations.Users.getAllUsers();

        const filteredUsers = users.map(user => {

            const { _id, name, email, image } = user;

            return {
                id: _id,
                name,
                email,
                image
            };

        });

        res.status(201).json({
            error: null,
		    ok: true,
		    status: 200,
		    message: 'All Users',
		    data: {
                users: filteredUsers 
            }
        });


    } catch (error) {
        
        next(error);

    }   


};


const signup = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {

        return next(createError(422, 'BAD REQUEST'));
    }

    const { name, email, password } = req.body;

    try {
        
        const userData ={
            name,
            email,
            password,
            image: req.file.path  //*** OJO MULTER CARGA req.file , ASI QUE GUARDAMOS EN EL SERVIDOR LA RUTA DEL ARCHIVO req.file.path QUE ES LA RUTA DEL ARCHIVO EN EL SERVIDOR, INCLUYENDO EL NOMBRE. */
        };

        const newUser = await crudOperations.Users.addNewUser(userData);

        const token = jwt.generateUserToken(newUser);
        

        res.status(201).json({
            error: null,
		    ok: true,
		    status: 200,
		    message: 'User Signed Up Successfully',
		    data: {
                user: {
                    id: newUser._id,
                    email: newUser.email
                },
                token
            }
        });


    } catch (error) {
        
        next(error);

    }

};


const login = async (req, res, next) => {

    const { email, password } = req.body;

    try {
        
        const user = await crudOperations.Users.loginUser(email, password);

        const token = jwt.generateUserToken(user);


        res.status(200).json({
            error: null,
		    ok: true,
		    status: 200,
		    message: 'User Logged In Successfully',
		    data: {
                user: {
                    id: newUser._id,
                    email: newUser.email
                },
                token
            }
        });


    } catch (error) {
        
        next(error);

    }
      

};


module.exports={
    getUsers,
    signup,
    login
};