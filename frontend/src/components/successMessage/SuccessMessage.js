import React from "react";
import "./successMessage.css";

const SuccessMessage = ({ message }) => {
  return <div className="success-message">✅ {message}</div>;
};

export default SuccessMessage;
