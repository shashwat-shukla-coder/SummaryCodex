import "./landingPage.css";
import { Container, Row } from "react-bootstrap";

const LandingPage = () => {
  return (
    <>
      <div className={`main`}>
        <Container>
          <Row className="justify-content-center text-center">
            <div className="intro-text">
              <h1 className="intro1">Summary Lock</h1>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default LandingPage;
