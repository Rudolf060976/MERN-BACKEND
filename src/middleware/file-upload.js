const multer = require('multer');


const MAX_SIZE_MB = 2;

const limits = {

    files: 1,
    fileSize: MAX_SIZE_MB * 1024 * 1024
};

const MIME_TYPE_MAP = {
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/png': 'png'    
};

const fileFilter = (req, file, cb) => {

    // SELECT HERE WICH FILES TO IGNORE CALLING cb(null, false) or cb(new Error())

	const isValid = !!MIME_TYPE_MAP[file.mimetype];

    if(!isValid) cb(null, false);	

	cb(null, true);

};


const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, 'uploads/images');

    },    
    filename: function (req, file, cb) {

        const ext = MIME_TYPE_MAP[file.mimetype];

        cb(null, file.fieldname + '-' + Date.now() + '.' + ext);

    }
});


const fileUpload = multer({
    limits,
    fileFilter,
    storage
});



module.exports = fileUpload;