//schema build
const mongoose = require('mongoose');
//not necessary. just shorthand to use Schema not all
const Schema = mongoose.Schema;
//new currency type schema for db to use
require('mongoose-currency').loadType(mongoose);
//shorthand
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const campsiteSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, {
    timestamps: true
});
//new Model searches the collection to be Capitalized and singular
//we also pass the schema for the model to use.
//returns a constructor function
//Models are de-sugared classes method instantiated
const Campsite = mongoose.model('Campsite', campsiteSchema);


module.exports = Campsite;


