import React, { useState } from 'react';
import './App.css';
import OtpInput from './components/OtpInput';

export default function App() {
  const [otp, setOtp] = useState("")  // "654321".split("") =>  [6,5,4,3,2,1]
  const onChange = (value: string, ) => {
    setOtp(value)
  }
  return (
    <div className="container">
      <h1>Ract Typescript OTP Input</h1>
        <OtpInput  value={otp}  valueLength={6} onChange={onChange}  />
    </div>
  );
}

