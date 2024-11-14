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


function Header() {
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
    <Navbar expand="lg" className="bg-body-tertiary" variant="dark" bg="info">
      <Container>
        <Navbar.Brand style={{ color: "red", fontWeight: "bold" }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
            Note Codex
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
              />
              <Button variant="primary" className="ml-1">
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
            <NavDropdown title="Name" id="navbarScrollingDropdown">
              <NavDropdown.Item as={Link} to="/profile">
                My Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/bookmark">
                My Bookmarked Notes
              </NavDropdown.Item>
              <NavDropdown.Divider />
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
