const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;

const types = mongoose.SchemaTypes;


const userSchema = new Schema({

    _id: types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
			validator: function(v) {
				return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
			},
			message: props => `${props.value} is not a valid email!`
		}
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 12
    },
    image: {
        type: String,
        required: true
    },
    places: [{ type: types.ObjectId, ref: 'Place' }]

});

userSchema.plugin(uniqueValidator);

userSchema.pre('save', function() {

    const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(this.password, salt);

    this.password = hash;    

});


module.exports = mongoose.model('User', userSchema);