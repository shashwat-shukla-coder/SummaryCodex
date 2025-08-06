import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Row,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userActions";
import Register from "../register/Register";
import Login from "../login/Login";
import "./Header.css";

function Header({ setSearch }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [activeModal, setActiveModal] = useState(null);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleLoginClick = () => {
    setActiveModal("login");
  };

  const handleRegisterClick = () => {
    setActiveModal("register");
  };

  const handleClose = () => {
    setActiveModal(null);
  };

  useEffect(() => {}, [userInfo]);

  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary sticky-top"
      variant="dark"
      style={{ backgroundColor: "black" }}
    >
      <Container>
        <Navbar.Brand style={{ color: "yellow", fontWeight: "bold" }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
            SummaryCodex
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="primary" className="ml-1 custom-button">
                Search
              </Button>
            </Form>
          </Nav>

          <Nav
            className="ml-auto my-2 my-lg-0 align-items-center"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Navbar.Brand style={{ color: "white", marginRight: "20px" }}>
              <Link
                to="/mynotes"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                My Notes
              </Link>
            </Navbar.Brand>

            {!userInfo && (
              <div className="d-flex align-items-center">
                <Button
                  onClick={handleLoginClick}
                  size="md"
                  variant="outline-light"
                  className="me-2"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleRegisterClick}
                  size="md"
                  variant="outline-light"
                  className="me-2"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Modals*/}
            {activeModal === "login" && (
              <div className="login-container">
                <Login
                  onSignUpClick={handleRegisterClick}
                  activeModal={setActiveModal}
                />
              </div>
            )}

            {activeModal === "register" && (
              <div className="login-container">
                <Register activeModal={setActiveModal} />
              </div>
            )}

            {/* Dropdown*/}
            <NavDropdown
              title={userInfo ? userInfo.username : "guest"}
              id="navbarScrollingDropdown"
            >
              {userInfo && (
                <NavDropdown.Item onClick={logoutHandler}>
                  Logout
                </NavDropdown.Item>
              )}
              {!userInfo && (
                <NavDropdown.Item onClick={logoutHandler}>
                  Not Logged In
                </NavDropdown.Item>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
