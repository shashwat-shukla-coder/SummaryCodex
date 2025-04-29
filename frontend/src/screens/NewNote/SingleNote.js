import React from "react";
import { useState, useEffect } from "react";
import MainScreen from "../../components/MainScreen/MainScreen";
import { useParams } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { updateNoteAction, listNotes } from "../../actions/noteActions";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loadingcomp/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import axios from "axios";

const SingleNote = () => {
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [category, setCategory] = useState();
  const [date, setDate] = useState("");
  const [summarizedContent, setSummarizedContent] = useState(null);
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
  const AbstractivesummarizeHandler = async () => {
    try {
      const response = await axios.post("http://localhost:7000/abstractive", {
        text: content, // <-- important: 'text' not 'content'
      });

      const summary = response.data.summary;
      setSummarizedContent(summary); // trigger auto-save via useEffect
      setContent(summary); // show summarized text in the textarea
    } catch (error) {
      console.error("Summarization failed:", error);
    }
  };
  //extractive summary handler
  const ExtractivesummarizeHandler = async () => {
    try {
      const response = await axios.post("http://localhost:7000/extractive", {
        text: content, // <-- important: 'text' not 'content'
      });

      const summary = response.data.summary;
      setSummarizedContent(summary); // trigger auto-save via useEffect
      setContent(summary); // show summarized text in the textarea
    } catch (error) {
      console.error("Summarization failed:", error);
    }
  };

  return (
    <MainScreen title="Edit Note">
      <Card>
        <Card.Header>Edit Note</Card.Header>
        <Card.Body>
          <Form onSubmit={updateHandler}>
            {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="title"
                value={title}
                placeholder="Enter the title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                value={content}
                placeholder="Enter the content"
                rows={4}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
            {content && (
              <Card>
                <Card.Header>Note Preview</Card.Header>

                <ReactMarkdown>{content}</ReactMarkdown>
              </Card>
            )}
            <Form.Group controlId="category" style={{ marginBottom: "1rem" }}>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={category}
                placeholder="Enter the Category"
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            {loading && <Loading size={50} />}
            <Button type="submit" variant="primary">
              
              Update Note
            </Button>

            <Button
              style={{ padding: "2", marginRight: "10px", marginLeft: "10px" }}
              onClick={AbstractivesummarizeHandler}
            >
              Abstractive Summary
            </Button>
            <Button
              style={{ padding: "2", marginRight: "10px" }}
              onClick={ExtractivesummarizeHandler}
            >
              Extractive Summary
            </Button>
            <Button className="mx-2" onClick={resetHandler} variant="danger">
              Reset Fields
            </Button>
          </Form>
        </Card.Body>

        <Card.Footer className="text-muted">
          updated on -{" "}
          {date.substring(0, 10)
            ? date.substring(0, 10)
            : new Date().toISOString().substring(0, 10)}
        </Card.Footer>
      </Card>
    </MainScreen>
  );
};

export default SingleNote;
