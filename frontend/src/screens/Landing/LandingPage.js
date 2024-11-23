import React, { useState } from "react";
import "./landingPage.css";
import Login from "../../components/login/Login";
import Register from "../../components/register/Register";
import { Container, Row, Button } from "react-bootstrap";

const LandingPage = () => {
  const [activeModal, setActiveModal] = useState(null);

  const handleLoginClick = () => {
    setActiveModal("login");
  };
  const handleRegisterClick = () => {
    setActiveModal("register");
  };

  const handleClose = () => {
    setActiveModal(null);
  };

  return (
    <>
      <div className={`main ${activeModal ? "blur-background" : ""}`}>
        <Container>
          <Row className="justify-content-center text-center">
            <div className="intro-text">
              <h1 className="intro1">Note Codex</h1>
              <h2 className="intro2">All notes in one place</h2>
            </div>
          </Row>
          <Row className="justify-content-center">
            <div className="buttonContainer">
              <Button
                onClick={handleLoginClick}
                size="lg"
                variant="primary"
                className="m-2"
              >
                Sign In
              </Button>
              <Button
                onClick={handleRegisterClick}
                size="lg"
                variant="primary"
                className="m-2"
              >
                Sign Up
              </Button>
            </div>
          </Row>
        </Container>
      </div>

      {activeModal === "login" && (
        <div className="login-container">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="close-button"
          >
            X
          </Button>
          <Login onSignUpClick={handleRegisterClick} />
          {/* to open register via login slide */}
        </div>
      )}

      {activeModal === "register" && (
        <div className="login-container">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="close-button"
          >
            X
          </Button>
          <Register activeModal={setActiveModal} />
        </div>
      )}
    </>
  );
};

export default LandingPage;
