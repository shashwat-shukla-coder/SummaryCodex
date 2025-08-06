import React from "react";
import { Container, Row, Col } from "react-bootstrap/";

const Footer = () => {
  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "#f8f9fa",
        padding: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "1",
        boxSizing: "border-box",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        position: "relative",
        bottom: "0",
        textAlign: "center",
        color: "#111519ff",
      }}
    >
      <Container>
        <Row>
          <Col className="text-center-py-3">
            &copy; {new Date().getFullYear()} SummaryCodex. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
