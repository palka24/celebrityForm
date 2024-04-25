  
import express from 'express';
import mongoose from 'mongoose';
import dotENV from 'dotenv';
import OpenAIapi from 'openai';
import cors from 'cors';
import Form from './models/formSubmissions.js';
import { stringify, parse } from 'flatted';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const clientOptions = { serverApi: { version: '1' } };
const myENV = dotENV.config();
let formSubmissions;

//Open AI
const openai = new OpenAIapi({ apiKey: process.env.openAI_API_KEY });

//connect to database
connect();

async function connect() {
    try {
        await mongoose.connect(process.env.URI, clientOptions);
        console.log('Connected to MongoDB');
        await Form.createIndexes();
        formSubmissions = await getFormSubmissions();
        app.listen(process.env.PORT || 4000, () => console.log(`App available on http://localhost:4000`));

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}   

//submit form
app.post('/submit-form', async (req, res) => {
    // Handle form data here
    const formData = req.body; // This contains form field values
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            console.log(`${key}: ${formData[key]}`);
        }
    }
    //Get chatgpt response
    let AI_response = await callChatGPT(formData.name);

    //create new form submission
    await submitNewForm(formData, AI_response);
    return res.status(200).json(formData);
    //Set success page
});

app.get('/data', async (req, res) => {
        formSubmissions = await getFormSubmissions();    
        return res.status(200).json(formSubmissions); 
});

//Search for list of forms based on search input
app.post('/search', async (req, res) => {
    const searchTerm = req.body.searchTerm;
    //console.log('req' + req.body.searchTerm);
    searchForms(searchTerm).then(forms => {
        //console.log('searchForms' + forms);
         return res.status(200).json(forms);
     }).catch(err => {
         console.error(err);
         return res.status(400).json({message : err});
     });

})

function searchForms(query) {
    return Form.find({
        $text: { $search: query }
    }, {
        score: { $meta: "textScore" }
    }).sort({ score: { $meta: 'textScore' } });  // Sort by relevance
}

//update form when editing
app.put('/update/:id', async (req, res) =>{
    const updateReq = req.body
    const sendToChatGPT = updateReq.sendToChatGPT;

    try {
        if(sendToChatGPT){
            const { name } = req.body;
            const AI_Update = await callChatGPT(name);
            updateReq.celebritydescription = AI_Update;
        }

        const { id } = req.params;
        const result = await Form.findByIdAndUpdate(id, updateReq);

        if(!result){
            return res.status(404).json({message: 'Form not found'});
        }

        return res.status(200).send({message: 'Form updated!'});

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }

});

//delete form
app.delete('/delete/:id', async (req, res) =>{
    try{
        const { id } = req.params;
        const result = await Form.findByIdAndDelete(id);

        if(!result){
            return res.status(404).json({message: 'Form not found'});
        }

        return res.status(200).send({message: 'Form Deleted'});

    } catch(error) {
        console.log(error.message);
        res.status(500).send({message: error.message});
    }
});

//Submit new form to mongoDB
async function submitNewForm(formData, AI_response){

    try {
        const result = await Form.create({ 
            "name" : formData.name,
            "email" : formData.email,
            "phone" : formData.phone,
            "message" : formData.message,
            "celebritydescription" : AI_response
        });
        console.log(result);
    } catch (error) {
        console.log('form submission error: ' + error);
    }
}

//get form submissions
async function getFormSubmissions(){
    try {
        const formSubmissions = await Form.find();
        //console.log('formSubmissions--> ');
        formSubmissions.forEach(submission => {
            //console.log(submission.name);       
        }); 

        return formSubmissions;

    } catch(error) {
        console.log('error getting form submissions: ' + error);
    }
}

async function callChatGPT(famousPerson) {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "who is " + famousPerson + " and what are they known for? please condense your response to 75 tokens or less with complete sentences" }],
        model: "gpt-3.5-turbo",
        max_tokens: 75
    });
    let response = completion.choices[0].message.content;

    return response;
}