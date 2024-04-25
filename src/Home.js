import './stylesheet.css';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Spinner from './spinner';

function Home() {
  
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const validateEmail = (email) => {
    // Simple email regex pattern
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSaveForm = (event) => {
    const notifySubmitted = () => toast.success("Celebrity Entered!");
    const emailNotify = () => toast.warning("Please enter a valid email address.");
    event.preventDefault();
    if (!validateEmail(email)) {
      emailNotify();
      return;
    }
    
    setIsDataLoading(true);
    console.log('handlesave started');
    const data = {
      name,
      email,
      phone,
      message
    };

    axios.post('http://localhost:4000/submit-form', data)
    .then(() => {
      console.log('form submitted!!');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setIsDataLoading(false);
      setTimeout(() => notifySubmitted(), 1);
    }).catch((error) => {
      console.log('error submitting data ' + error);
      setIsDataLoading(false);
    });
  }

  function formatPhoneNumber(phoneNumber) {
    phoneNumber = phoneNumber.replace(/\D/g, '').slice(0, 10);
    if (phoneNumber.length === 10) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    } else {
      return phoneNumber;
    }
  }

  const handlePhoneInputChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhone(formattedPhoneNumber);
  };


    return (
      <div>
        <div className="container"> 
         {isDataLoading ? <Spinner /> :
         <>
            <form id="contactForm" >
              <h3>Quick Contact</h3>
              <h4>Please fill out the celebrity contact form!</h4>
              <fieldset>
                <input name="name" id="nameInput" placeholder="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} tabIndex="1" required autoFocus/>
              </fieldset>
              <fieldset>
                <input name="email" id="emailInput" placeholder="Your Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} tabIndex="2" required/>
              </fieldset>
              <fieldset>
                <input name="phone" id="phoneInput" placeholder="Your Phone Number" value={phone} onChange={handlePhoneInputChange} type="tel" tabIndex="3" required/>
              </fieldset>
              <fieldset>
                <textarea name="message" placeholder="Type your Message Here...." value={message} onChange={(e) => setMessage(e.target.value)} tabIndex="5" required></textarea>
              </fieldset>
              <fieldset>
                <button name="submit" type="submit" id="contact-submit" onClick={handleSaveForm}>Submit</button>
              </fieldset>  
            </form>
            <ToastContainer />
            </>
           }
           </div>
    </div>
    );
}
  export default Home;