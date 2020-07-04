const fs = require('fs');
const express = require('express');
require('./config/config');
const nconf = require('nconf');
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const connectDB = require('./database/mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const ENVConfig = nconf.get('ENV');

const app = express();


app.use(express.json());

app.use(logger('dev'));


app.use(express.static(path.join(__dirname,'..','uploads','images')));

app.use(express.static(path.join(__dirname,'..','public')));




app.use('/api/places', placesRoutes);

app.use('/api/users', usersRoutes);



// PARA EL API REST, TIENE QUE HABER UNA MIDDLEWARE AL FINAL, QUE CAPTURE CUALQUIER REQUEST A LA API QUE NO EXISTE.

app.all('/api/*', (req, res, next) => {

    throw createError(404, "That Route could not be found");

});

// PARA EL FRONT END QUE ES UNA SPA, CUANDO SE REFRESCA LA PAGINA EL BROWSER HACE UN GET REQUEST AL SERVIDOR, Y COMO LAS RUTAS EN UNA SPA SON EN EL CLIENTE, EL SERVIDOR TIENE QUE DEVOLVER SIEMPRE index.html

app.all('*', (req, res, next) => {
    
    res.sendFile(path.join(__dirname,'..','public','index.html'));

});

// Error handler

app.use((err, req, res, next) => {

    if (req.file) {  //SI HAY UN ERROR, Y SE HIZO UN UPLOAD DE UN ARCHIVO AL SERVIDOR, HAY QUE ELIMINAR ESE ARCHIVO
        // EL ERROR PUEDE HABER SIDO POR VALIDACION, O POR CUALQUIER OTRA COSA EN LA RUTA O EN LA OPERACION CON LA DB.

        fs.unlink(req.file.path, error => {

            console.log(error);

        });

    }


    // when you add a custom error handler, you must delegate to the default Express error handler, when the headers have already been sent to the client:
    if (res.headersSent) {
        return next(err)
    }

    return res.status(err.status || 500).json({
		error: createError(err.status || 500, err.message),
		ok: false,
		status: err.status,
		message: 'ERROR: ' + err.message,
		data: null
	});

});

connectDB().then(() => {

    app.listen(3000, () => {

        console.log('Server Ready and Listening on Port: ' + ENVConfig.PORT );
    
    });

}).catch((error) => {

    console.log(error.message);

});
