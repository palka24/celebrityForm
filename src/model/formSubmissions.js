const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    celebritydescription: {
        type: String,
        required: true
    },  
}, {timestamps: true});

const Form = mongoose.model('form-submission', formSchema);

module.exports = Form;