import mongoose from 'mongoose';
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

formSchema.index({
    name: 'text',
    email: 'text',
    phone: 'text',
    message: 'text',
    celebritydescription: 'text'
}, { name: "MyTextIndex" });

const Form = mongoose.model('form-submission', formSchema);
// Form.createIndex({ 
//     name: 'text', 
//     email: 'text', 
//     phone: 'text', 
//     message: 'text', 
//     celebritydescription: 'text'
// });
//Form.ensureIndexes();

export default Form;