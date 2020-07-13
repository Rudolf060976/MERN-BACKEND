
const createError = require('http-errors');
const jwt = require('../util/JWT/userTokens');

const checkIsAuthenticated = () => {

    return (req, req, next) => {

        if(req.method === 'OPTIONS') { // SI EL NAVEGADOR HA ENVIADO UN OPTIONS REQUEST, DEJAMOS SEGUIR SIN HACER NADA...
            next(); 
        }

        try {

            const token = req.get('authorization').split(' ')[1]; // PORQUE EL VALOR DEL HEADER ES 
            // Authorization: 'Bearer Token' Y NOS INTERESA EL TOKEN
    
            if(!token) {
                throw createError(403, 'Authentication Required!');
            }

            // HASTA AQUI SOLO CONFIRMAMOS QUE VIENE UN TOKEN EN EL REQUEST. AHORA HAY QUE VALIDAR EL TOKEN

            const payload = jwt.verifyUserToken(token); // SI EL TOKEN NO ES VALIDO, GENERA UN ERROR.

            if(!payload) throw createError(403, 'Authentication Required'); // SI EL TOKEN ES VALIDO PERO NO TIENE PAYLOAD, DEVUELVE NULL

            req.user.id = payload.userId;

            req.user.email = payload.email;

            next();
            
        } catch (error) {

            return next(error);
            
        }    
     
    }

};


module.exports= {

    checkIsAuthenticated

};

