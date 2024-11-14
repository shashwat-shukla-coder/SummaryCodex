import React from "react";
import { Alert } from "react-bootstrap";
const ErrorMessage = ({ variant = "info", children }) => {
  return (
    <div>
      <Alert variant={variant} style={{ font: "bold" }}>
        <strong>{children}</strong>
      </Alert>
    </div>
  );
};

export default ErrorMessage;
