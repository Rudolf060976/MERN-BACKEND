const jwt = require('jsonwebtoken');

const createError = require('http-errors');

const appConfig = nconf.get('APP');

const Options = { // **** OPTIONS FOR GENERATED TOKENS	
	algorithm: 'HS256',
	expiresIn: appConfig.Token_Expiration_Time_In_Seconds * 1
};


const secretOrKey = appConfig.Token_Secret_String;


const generateUserToken = async user => {

	try {

		const { _id } = user;

		const payload = {
			userId: _id
		};	

		const token = await jwt.sign(payload, secretOrKey, Options);

		return token;
		
	} catch (error) {
		
		throw createError(500, 'Could Not Create the Token');

	}	

};

const verifyUserToken = token => {
		
		const payload = jwt.verify(token, secretOrKey, Options);

		if(payload) {
			
			const { userId } = payload;

			return {
                userId
            };
		}

		return null;
	
};


module.exports = { 
	generateUserToken,
	verifyUserToken
}

