import './stylesheet.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from './spinner';
import Pagination from './Pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListView = () => {
  const notify = () => toast.success("Celebrity has been updated!");
  const notifyDelete = () => toast.error("Celebrity has been Deleted!");
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [forms, setForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = forms.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(forms.length / recordsPerPage)

  useEffect(() => {
    setIsDataLoading(true);
    axios.get('http://localhost:4000/data').then((response) => {
      setForms(response.data);
      setIsDataLoading(false);
    }).catch((error) => {
      console.log('error getting forms ' + error);
      setIsDataLoading(false);
    })
  }, []);

  // Record component to display each record
  function Record({ record }) {
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [celebritydescription, setCelebrityDescription] = useState('');
    const [ sendToChatGPT, setSendToChatGPT] = useState(false);

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
      console.log('handlesave started');
      
      const data = {
        name,
        email,
        phone,
        message,
        celebritydescription,
        sendToChatGPT
      };

      console.log('data=> ' + JSON.stringify(data));
      
      axios.put(`http://localhost:4000/update/${id}`, data)
      .then(() => {
          
        console.log('send=> ' + sendToChatGPT); 
        console.log('form Updated!!!!');
        setEditMode(!editMode); 
        
        axios.get('http://localhost:4000/data').then((response) => {
          setForms(response.data);
          setIsDataLoading(false);
          setTimeout(() => notify(), 1);
          console.log('after notify!!');
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
      console.log('handleDelete started');
      axios.delete(`http://localhost:4000/delete/${id}`)
      .then(() => {
        console.log('form Deleted!!');
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
  }

  const handleSearchChange = (e) => {
    const searchString = e.target.value;
    if(searchString ===''){
      axios.get('http://localhost:4000/data').then((response) => {
      setForms(response.data);
    }).catch((error) => {
      console.log('error getting forms ' + error);
    })
      return;
    }
    console.log('search start!');
    setSearchTerm(searchString);
    const searchData = {
      searchTerm : searchString
    };
    console.log('searchData ' + JSON.stringify(searchData));
    axios.post('http://localhost:4000/search/', searchData)
    .then((response) => {
             
      console.log('search result!');
      setForms(response.data);
    }).catch((error) => {
      console.log('error submitting search ' + error);
    });
  }

  return (
    <div>
      <div className="record-container">
        <h3 className="heading">List of Contacts</h3>
        <div className ="row">
          <div className="col">
          <strong>Search: </strong><input className="searchBox" type="text" onChange={handleSearchChange}/>
          </div>
          <div className="col">
          <Pagination
                nPages={nPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
        <div id="recordList" className="card-container">
          {isDataLoading ? <Spinner/> : currentRecords.map((recordToDisplay, index) => (
            <Record
              key={index}
              record={recordToDisplay}
            />
          ))}
        </div>
      </div>
      {/* <Pagination
                nPages={nPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            /> */}
    </div>
  );
}

export default ListView;
