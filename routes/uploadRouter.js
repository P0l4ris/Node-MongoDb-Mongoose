const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

//custom configs for multer handling file uploads
const storage = multer.diskStorage({
    //callback function we use cb
    destination: (req, file, cb) => {
        //error, path 
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        //error, how to name file specifically
        cb(null, file.originalname)
    }
});

//fileFilter


const imageFileFilter = (req, file, cb) => {
    //true/false tells multer to reject upload
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can only upload image files!'), false);
    }
    //call the callback again to proceed
    cb(null, true);

};

//make our multer function passing the options we configured
const upload = multer({ storage: storage, fileFilter: imageFileFilter});


//now our routes
const uploadRouter = express.Router();

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});


module.exports = uploadRouter;