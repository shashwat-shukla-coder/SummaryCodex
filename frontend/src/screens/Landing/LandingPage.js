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
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  maxWidth: "800px",
                  margin: "0 auto",
                }}
              >
                <div style={{ flex: "1 1 45%", padding: "10px" }}>
                  <h3 className="intro2">Note taking app</h3>
                </div>
                <div style={{ flex: "1 1 45%", padding: "10px" }}>
                  <h3 className="intro2">Effortless Summarization</h3>
                </div>
                <div style={{ flex: "1 1 45%", padding: "10px" }}>
                  <h3 className="intro2">Bookmark your priority notes</h3>
                </div>
                <div style={{ flex: "1 1 45%", padding: "10px" }}>
                  <h3 className="intro2">
                    Text to voice for notes read through
                  </h3>
                </div>
                <div style={{ flex: "1 1 45%", padding: "10px" }}>
                  <h3 className="intro2">Your Notes, Your Control</h3>
                </div>
                <div style={{ flex: "1 1 45%", padding: "10px" }}>
                  <h3 className="intro2">Secure and Private</h3>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default LandingPage;
