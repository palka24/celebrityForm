//App to Collect contact form submissions and submit them to mongoDB

//Epics
 //Redo front end with react
    //Redo error pages if not loaded or form doesn't go in
    //make loading page when form is submitted
 //Get into AWS

//Current TODOS
    //TODO: connect back end to new front end react

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const myENV = require('dotenv').config();
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const { readFile } = require('fs').promises;
const path = require('path');
const Form = require('./model/formSubmissions');
let formSubmissions;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

//Open AI
const OpenAIApi= require("openai");
const openai = new OpenAIApi({ apiKey: process.env.openAI_API_KEY });

async function callChatGPT(famousPerson) {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "who is " + famousPerson + " and what are they known for? please condense your response to 75 tokens or less with complete sentences" }],
      model: "gpt-3.5-turbo",
      max_tokens: 75
    });
    let response = completion.choices[0].message.content;
    //console.log('response ' + response);
    return response;
  }

// async function getchatgptresponse(){  
//     let AITest = await callChatGPT(famousPersonName);
//     console.log('response ' + AITest);
// }

//connect and setup home page
connect();
//setHomePage();

async function connect() {
    try {
        await mongoose.connect(process.env.URI, clientOptions);
        console.log('Connected to MongoDB');
        formSubmissions = await getFormSubmissions();
        app.listen(process.env.PORT || 5000, () => console.log(`App available on http://localhost:5000`));
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}   

// async function setHomePage(){

//     app.get('/', async (request, response) => {
//         try {
//             response.set('Content-Type', 'text/html');
//             const htmlContent = await readFile('./public/home.html', 'utf8');
//             response.send(htmlContent);
//         } catch (error) {
//             console.error('Error reading HTML file:', error);
//             response.status(500).send('Internal Server Error');
//         }
//     });

//     app.get('/script.js', (req, res) => {
//         try {
//             res.setHeader('Content-Type', 'application/javascript');
//             res.sendFile(__dirname + '/script.js');
//         } catch (error) {
//             console.error('Error serving script.js:', error);
//             res.status(500).send('Internal Server Error');
//         }
//     });
    
//     app.get('/public/stylesheet.css', (req, res) => {
//         try {
//             res.setHeader('Content-Type', 'text/css');
//             res.sendFile(__dirname + '/public/stylesheet.css');
//         } catch (error) {
//             console.error('Error serving stylesheet.css:', error);
//             res.status(500).send('Internal Server Error');
//         }
//     });
    
    

// }

//submit form action from page
app.post('/submit-form', async (req, res) => {
    // Handle form data here
    const formData = req.body; // This contains form field values
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            console.log(`${key}: ${formData[key]}`);
        }
    }
    //Get chatgpt response
    const AI_response = await callChatGPT(formData.name);

    //create new form submission
    await submitNewForm(formData, AI_response);
   
    //Set success page
    res.set('Content-Type', 'text/html');
            const htmlContent = await readFile('./public/1success.html', 'utf8');
            res.send(htmlContent);
});

app.get('/data', async (req, res) => {
        formSubmissions = await getFormSubmissions();    
        res.json(formSubmissions); 
});

//Submit new form to mongoDB
async function submitNewForm(formData, AI_response){
    console.log('AI Response ' + AI_response)
    try {
        const result = await Form.create({ 
            "name" : formData.name,
            "email" : formData.email,
            "phone" : formData.phone,
            "message" : formData.message,
            "celebritydescription" : AI_response
        });
    } catch (error) {
        console.log('form submission error: ' + error);
    }
}

//get form submissions
async function getFormSubmissions(){
    try {
        const formSubmissions = await Form.find();
        /*console.log('formSubmissions--> ');
        formSubmissions.forEach(submission => {
            console.log(submission.name);       
        }); */

        return formSubmissions;

    } catch(error) {
        console.log('error getting form submissions: ' + error);
    }
}

module.exports = {
    getFormSubmissions,
};