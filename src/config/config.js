require('custom-env').env(true,__dirname + './../../');
const randomstring = require('randomstring');
const path = require('path');

const nconf = require('nconf');


nconf.argv()
    .env()
    .file( { file: path.join(__dirname,'..','..','config.json')} );

nconf.set('RANDOM_STRING', randomstring.generate(10));

nconf.defaults({
    
    App_Base_Url: "http://localhost:4000" 

});

const env = nconf.get('NODE_ENV') || 'development';

let mongoUri = nconf.get('MONGODB_URI');

/*  if (env === 'development') {
	mongoUri = nconf.get('MONGODB_URI') + '/' + nconf.get('DB_NAME');
} else if (env === 'test') {
	mongoUri = nconf.get('MONGODB_URI') + '/' + nconf.get('DB_NAME') + '-Test';
}  */

// ENV CONFIG

nconf.set('ENV:ENV', env);
nconf.set('ENV:MONGO_URI', mongoUri);
nconf.set('ENV:PORT', nconf.get('PORT'));

// APP CONFIG

nconf.set('APP:App_Base_Url', nconf.get('App_Base_Url'));
nconf.set('APP:Token_Expiration_Time_In_Seconds', nconf.get('Token_Expiration_Time_In_Seconds'));
nconf.set('APP:Token_Secret_String', nconf.get('Token_Secret_String'));



console.log('env *****', env);
console.log('PORT = ', nconf.get('PORT'));
console.log('MONGODB_URI = ', mongoUri);
