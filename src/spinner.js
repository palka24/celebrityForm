import './stylesheet.css';
import React, { useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';

function Spinner () {
return(<RotatingLines
    visible={true}
    height="96"
    width="96"
    strokeColor="rgb(211, 106, 54)"
    strokeWidth="5"
    animationDuration="0.75"
    ariaLabel="rotating-lines-loading"
    wrapperStyle={{}}
    wrapperClass=""
    className="mx-auto"
    />)
}

export default Spinner;