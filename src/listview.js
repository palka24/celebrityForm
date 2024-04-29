import './stylesheet.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from './spinner';
import Pagination from './Pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Record from './Record';

const ListView = () => {
  const notify = () => toast.success("Celebrity has been updated!");
  const notifyDelete = () => toast.error("Celebrity has been Deleted!");
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [forms, setForms] = useState([]);
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
    const searchData = {
      searchTerm : searchString
    };
    axios.post('http://localhost:4000/search/', searchData)
    .then((response) => {
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
            setIsDataLoading={setIsDataLoading}
            setForms={setForms}
            notify={notify}
            notifyDelete={notifyDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListView;
