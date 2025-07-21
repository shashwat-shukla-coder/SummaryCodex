import React from "react";
import { useState, useEffect } from "react";
import MainScreen from "../../components/MainScreen/MainScreen";
import { useParams } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { updateNoteAction, listNotes } from "../../actions/noteActions";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loadingcomp/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import axios from "axios";

const SummaryNote = () => {
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [category, setCategory] = useState();
  const [date, setDate] = useState("");
  const [summarizedContent, setSummarizedContent] = useState(null);
  const [summarizingLoading, setSummarizingLoading] = useState(false);

  const { id } = useParams();
  console.log("Extracted ID:", id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const resetHandler = () => {
    setTitle("");
    setCategory("");
    setContent("");
  };

  const noteUpdate = useSelector((state) => state.noteUpdate);
  const { loading, error } = noteUpdate;

  useEffect(() => {
    const fetching = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        console.log(userInfo.token);
        const { data } = await axios.get(`/notes/${id}`, config);
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
        setDate(data.updatedAt);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetching();
  }, [id, date]);

  const updateHandler = async (e) => {
    e.preventDefault();
    dispatch(updateNoteAction(id, title, content, category));
    if (!title || !content || !category) return;
    await dispatch(listNotes());

    resetHandler();
    navigate("/mynotes");
  };
  // this is the part where i insert the summarize logic
  //abstractive summary handler
  // Abstractive summary handler
  // const AbstractivesummarizeHandler = async () => {
  //   setSummarizingLoading(true);
  //   try {
  //     const response = await axios.post("http://localhost:7000/abstractive", {
  //       text: content,
  //     });
  //     const summary = response.data.summary;
  //     setSummarizedContent(summary);
  //   } catch (error) {
  //     console.error("Abstractive summarization failed:", error);
  //   } finally {
  //     setSummarizingLoading(false);
  //   }
  // };

  Extractive summary handler
  const ExtractivesummarizeHandler = async () => {
    setSummarizingLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/notes/summarize/extractive",
        { content },
        config
      );
      setSummarizedContent(data.summary);
    } catch (error) {
      console.error("Extractive summarization failed:", error);
    } finally {
      setSummarizingLoading(false);
    }
  };

  return (
    <MainScreen
      title="Summarize"
      style={{
        fontWeight: "bold",
        backgroundColor: "#1e1e2f",
        color: "#e0e0e0",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Card className="mb-3 ">
        <Card.Header
          style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            backgroundColor: "#3a3a5a",
            color: "white",
          }}
        >
          Summarize
        </Card.Header>
        <Card.Body>
          <Form onSubmit={updateHandler}>
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
                  summary Preview
                </Card.Header>
                <Card.Body>
                  <div
                    style={{
                      color: "#dcdcdc",
                      lineHeight: "1.6",
                      fontSize: "1.3rem",
                      fontWeight: "600",
                      backgroundColor: "#3a3a5a",
                    }}
                  >
                    {summarizedContent}
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
                Update Note
              </Button>
              {/* <Button
                variant="secondary"
                style={{ backgroundColor: "#718096", border: "none" }}
                onClick={AbstractivesummarizeHandler}
              >
                Abstractive Summary
              </Button> */}
              <Button
                variant="secondary"
                style={{ backgroundColor: "#63b3ed", border: "none" }}
                onClick={ExtractivesummarizeHandler}
              >
                Extractive Summary
              </Button>
              <Button
                variant="danger"
                style={{ backgroundColor: "#e53e3e", border: "none" }}
                onClick={resetHandler}
              >
                Reset Fields
              </Button>
            </div>
            {summarizingLoading && (
              <div className="mt-3">
                <Loading size={50} />
                <div
                  style={{
                    color: "#ccc",
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                >
                  Generating summary, please wait...
                </div>
              </div>
            )}
          </Form>
        </Card.Body>

        <Card.Footer
          className="text-muted"
          style={{ backgroundColor: "#2e2e44" }}
        >
          Updated on -{" "}
          {date?.substring(0, 10) || new Date().toISOString().substring(0, 10)}
        </Card.Footer>
      </Card>
    </MainScreen>
  );
};

export default SummaryNote;
