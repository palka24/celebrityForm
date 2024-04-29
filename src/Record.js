import React, {useState} from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const validateEmail = (email) => {
    // Simple email regex pattern
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  function formatPhoneNumber(phoneNumber) {
      
    phoneNumber = phoneNumber.replace(/\D/g, '').slice(0, 10);
    if (phoneNumber.length === 10) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    } else {
      return phoneNumber;
    }
  }

  const Record = ({ record, setIsDataLoading, setForms, notify, notifyDelete }) => {
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [celebritydescription, setCelebrityDescription] = useState('');
    const [sendToChatGPT, setSendToChatGPT] = useState(false);
  
    // Include handleEditSaveForm, handleDeleteForm, and any other local handlers...
    const handleEditSaveForm = (record) => {

        const emailNotify = () => toast.warning("Please enter a valid email address.");
        //event.preventDefault();
        if (!validateEmail(email)) {
          emailNotify();
          return;
        }
        
        setIsDataLoading(true);
        //setSendToChatGPT(true);
        const id = record._id;
        
        const data = {
          name,
          email,
          phone,
          message,
          celebritydescription,
          sendToChatGPT
        };
        
        axios.put(`http://localhost:4000/update/${id}`, data)
        .then(() => {
            
          setEditMode(!editMode); 
          
          axios.get('http://localhost:4000/data').then((response) => {
            setForms(response.data);
            setIsDataLoading(false);
            setTimeout(() => notify(), 1);
          }).catch((error) => {
            console.log('error getting forms ' + error);
            setIsDataLoading(false);
          })
        }).catch((error) => {
          console.log('error submitting data ' + error);
          setIsDataLoading(false);
        });
      }
    
      const handleDeleteForm = (record) => {
        setIsDataLoading(true);
        const id = record._id;
        axios.delete(`http://localhost:4000/delete/${id}`)
        .then(() => {
          setEditMode(!editMode);
          axios.get('http://localhost:4000/data').then((response) => {
            setForms(response.data);
            setIsDataLoading(false);
            setTimeout(() => notifyDelete(), 1);
          }).catch((error) => {
            console.log('error getting forms ' + error);
            setIsDataLoading(false);
          })
        }).catch((error) => {
          console.log('error deleting form ' + error);
          setIsDataLoading(false);
        });
      }
    
      const handleEditClick = () => { 
        if (!editMode) {
          // Set the form fields to the current values
          setName(record.name);
          setEmail(record.email);
          setPhone(record.phone);
          setMessage(record.message);
          setCelebrityDescription(record.celebritydescription);
          setSendToChatGPT(false);
        }
        setEditMode(!editMode);
        
      };

      const handlePhoneInputChange = (e) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setPhone(formattedPhoneNumber);
      };
  
      const handleCheckboxChange = (e) => {
        setSendToChatGPT(e.target.checked);
      } 
  
    return (
      <div key={record._id} className="card">
        <div>
          <ToastContainer />
          {/* Buttons and form inputs */}
          <button className="btn btn-primary" onClick={handleEditClick}>
            {editMode ? "Cancel" : "Edit"}
          </button>
          {/* Save button is displayed only in edit mode */}
          {editMode && <button className="btn btn btn-danger float-right" onClick={() => handleDeleteForm(record)}>Delete</button>}
          {editMode && <button className="btn btn-primary float-right" onClick={() => handleEditSaveForm(record)}>Save</button>}
        </div>
        {/* Display input fields only in edit mode */}
        {editMode ? (
          <div>
            <form id="contactForm" >
              <div className="row">
                <div className="col">
                  <fieldset>
                    <p><strong>Name: </strong><input type="text" value={name} onChange={(e) => setName(e.target.value)}  /></p>
                  </fieldset>
                </div>
                <div className="col">
                  <fieldset>
                    <p><strong>Email: </strong><input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/></p>
                  </fieldset>
                </div>
                <div className="col">
                  <fieldset>
                    <p><strong>Phone: </strong><input type="text" value={phone} onChange={handlePhoneInputChange}/></p>
                  </fieldset>
                </div>
              </div>
              <fieldset>
                <p><strong>Message: </strong><input type="text" value={message} onChange={(e) => setMessage(e.target.value)}/></p>
              </fieldset>
              <fieldset>
                <p><strong>Who is this person?: </strong><textarea cols="100" rows="1" value={celebritydescription} onChange={(e) => setCelebrityDescription(e.target.value)}/></p>
              </fieldset>
              <fieldset>
                <p><strong>Resend to ChatGPT </strong><input type="checkbox" checked={sendToChatGPT} onChange={handleCheckboxChange}/></p>
              </fieldset>
            </form>
          </div>
        ) : (
          <div>
            <h2>{record.name}</h2>
            <p> </p>
            <p> </p>
            <div className="row">
              <div className="col">
                <strong>Email:</strong> {record.email}
              </div>
              <div className="col">
                <strong>Phone:</strong> {record.phone}
              </div>
            </div>
            <p><strong>Message:</strong> {record.message}</p>
            <p><strong>Who is this person?:</strong> {record.celebritydescription}</p>
          </div>
        )}
      </div>
    );
  };
  
  export default Record;