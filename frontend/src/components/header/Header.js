import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Header.css"

function Header({ setSearch }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };
  useEffect(() => {}, [userInfo]);
  return (
    <Navbar
      expand="lg"
      className=" bg-body-tertiary sticky-top"
      variant="dark"
      style={{ backgroundColor: "indigo" }}
    >
      <Container>
        <Navbar.Brand style={{ color: "yellow", fontWeight: "bold" }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
            Summary Lock
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
            className="ml-auto my-2 my-lg-0" // Aligns the Nav to the right
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Navbar.Brand style={{ color: "white" }}>
              <Link
                to="/mynotes"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                My Notes
              </Link>
            </Navbar.Brand>
            <NavDropdown
              title={userInfo ? userInfo.username : "guest"}
              id="navbarScrollingDropdown"
            >
              <NavDropdown.Item onClick={logoutHandler}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
