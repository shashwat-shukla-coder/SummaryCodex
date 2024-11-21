import React, { useState } from "react";
import "./landingPage.css";
import Login from "../../components/login/Login";
import Register from "../../components/register/Register";
import { Container, Row, Button } from "react-bootstrap";

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };
  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false); // Hide login when showing register
  };

  const handleClose = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <>
      <div
        className={`main ${showLogin || showRegister ? "blur-background" : ""}`}
      >
        <Container>
          <Row>
            <div className="intro-text">
              <h1 className="intro1">Welcome to Note Codex</h1>
              <h2 className="intro2">We keep track of all your notes</h2>
            </div>
            <div className="buttonContainer">
              <Button onClick={handleLoginClick} size="lg" variant="primary">
                Login
              </Button>
              <Button onClick={handleRegisterClick} size="lg" variant="primary">
                Sign Up
              </Button>
            </div>
          </Row>
        </Container>
      </div>

      {showLogin && (
        <div className="login-container">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="close-button"
          >
            X
          </Button>
          <Login onSignUpClick={handleRegisterClick} />{/* to open register via login slide */}
        </div>
      )}

      {showRegister && (
        <div className="login-container">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="close-button"
          >
            X
          </Button>
          <Register />
        </div>
      )}
    </>
  );
};

export default LandingPage;
