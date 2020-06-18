const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];

const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    //indexOf returns -1 if none found
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        //accepting origin if found
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};


//specific application of CORS to routes here:
//returns a middleware config access-control-allow- origin with *wildcard
exports.cors = cors();
//with whitelist -same as top with specific not wildcard
exports.corsWithOptions = cors(corsOptionsDelegate);