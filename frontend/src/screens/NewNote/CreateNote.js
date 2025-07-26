import React, { useEffect, useState } from "react";
import MainScreen from "../../components/MainScreen/MainScreen";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createNoteAction, listNotes } from "../../actions/noteActions";
import Loading from "../../components/Loadingcomp/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const noteCreate = useSelector((state) => state.noteCreate);
  const { loading, error } = noteCreate;

  const resetHandler = () => {
    setTitle("");
    setCategory("");
    setContent("");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createNoteAction(title, content, category));
    dispatch(listNotes());
    setCreatedAt(new Date().toISOString());
    if (!title || !content || !category) return;
    resetHandler();
    navigate("/mynotes");
  };

  return (
    <MainScreen
      title="Create a note"
      style={{
        fontWeight: "bold",
        backgroundColor: "#1e1e2f",
        color: "#e0e0e0",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Card className="mb-3">
        <Card.Header
          style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            backgroundColor: "#3a3a5a",
            color: "white",
          }}
        >
          Create a New Note
        </Card.Header>
        <Card.Body>
          <Form onSubmit={submitHandler}>
            {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}

            <Form.Group controlId="title" className="mb-3">
              <Form.Label style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                Title
              </Form.Label>
              <Form.Control
                type="text"
                value={title}
                placeholder="Enter the title"
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  backgroundColor: "#34344a",
                  color: "#ffffff",
                  borderColor: "#5c5c7a",
                  borderRadius: "5px",
                }}
              />
            </Form.Group>

            <Form.Group controlId="content" className="mb-3">
              <Form.Label style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                Content
              </Form.Label>
              <Form.Control
                as="textarea"
                value={content}
                placeholder="Enter the content"
                rows={4}
                onChange={(e) => setContent(e.target.value)}
                style={{
                  backgroundColor: "#34344a",
                  color: "#ffffff",
                  borderColor: "#5c5c7a",
                  borderRadius: "5px",
                }}
              />
            </Form.Group>

            {content && (
              <Card
                style={{ backgroundColor: "#3b3b55", color: "#d0d0d0" }}
                className="mb-3"
              >
                <Card.Header
                  style={{ backgroundColor: "#4b4b6b", fontWeight: "600" }}
                >
                  Note Preview
                </Card.Header>
                <Card.Body>
                  <div
                    style={{
                      backgroundColor: "#34344a",
                      color: "#ffffff",
                      borderColor: "#5c5c7a",
                      borderRadius: "5px",
                      padding: "1rem",
                      lineHeight: "1.6",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                    }}
                  >
                    {content}
                  </div>
                </Card.Body>
              </Card>
            )}

            <Form.Group controlId="category" className="mb-3">
              <Form.Label style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                Category
              </Form.Label>
              <Form.Control
                type="text"
                value={category}
                placeholder="Enter the Category"
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  backgroundColor: "#34344a",
                  color: "#ffffff",
                  borderColor: "#5c5c7a",
                  borderRadius: "5px",
                }}
              />
            </Form.Group>

            {loading && <Loading size={50} />}

            <div className="d-flex flex-wrap gap-2 mt-3">
              <Button
                type="submit"
                variant="primary"
                style={{ backgroundColor: "#5a67d8", border: "none" }}
              >
                Create Note
              </Button>
              <Button
                variant="danger"
                onClick={resetHandler}
                style={{ backgroundColor: "#e53e3e", border: "none" }}
              >
                Reset Fields
              </Button>
            </div>
          </Form>
        </Card.Body>
        <Card.Footer
          style={{ backgroundColor: "#2e2e44" }}
          className="text-muted"
        >
          {createdAt
            ? `Created on - ${createdAt.substring(0, 10)}`
            : "Creating on - Not Set Yet"}
        </Card.Footer>
      </Card>
    </MainScreen>
  );
};

export default CreateNote;
