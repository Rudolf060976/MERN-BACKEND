const mongoose = require('mongoose');
const nconf = require('nconf');

const ENVConfig = nconf.get('ENV');

const MONGO_URI = ENVConfig.MONGO_URI;


const connectDB = () => {

    return mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

};

mongoose.connection.on('error', err => {

    console.log('MONGODB CONNECTION ERROR: ', err.message);    

});


module.exports = connectDB;
