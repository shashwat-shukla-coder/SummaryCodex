import React, { useEffect, useState } from "react";
import { Button, Card, Accordion, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listNotes, deleteNoteAction } from "../../actions/noteActions";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loadingcomp/Loading";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import MainScreen from "../../components/MainScreen/MainScreen";
import "./MyNotes.css";

const MyNotes = ({ search }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const noteList = useSelector((state) => state.noteList);
  const { loading, error, notes } = noteList;
  const userInfo = localStorage.getItem("userInfo");

  const name = userInfo ? JSON.parse(userInfo) : null;
  const newname = name && name.username ? name.username : "unknown";

  const noteDelete = useSelector((state) => state.noteDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = noteDelete;
  const [showBookmark, setShowBookmark] = useState(false);
  const [bookmarkStatus, setBookmarkStatus] = useState({}); // Track bookmark status for each note
  // Initialize bookmarkStatus state from notes
  useEffect(() => {
    if (notes) {
      const initialStatus = notes.reduce((acc, note) => {
        acc[note._id] = note.bookmark || false;
        return acc;
      }, {});
      setBookmarkStatus(initialStatus);
    }
  }, [notes]);

  // Function to handle deleting notes
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteNoteAction(id));
    }
  };

  // Toggle bookmark for each note
  const toggleBookmark = async (id) => {
    const token = JSON.parse(userInfo).token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.put(`/notes/bookmark/${id}/`, {}, config);
      if (data) {
        // Update bookmark status locally
        setBookmarkStatus((prev) => ({
          ...prev,
          [id]: data.bookmark,
        }));
      } else {
        console.error("No data in response");
      }
    } catch (error) {
      console.error(
        "Error updating bookmark:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(listNotes());
    } else {
      navigate("/");
    }
  }, [
    dispatch,
    userInfo,
    successDelete,
    navigate,
    showBookmark,
    setShowBookmark,
  ]);

  return (
    <MainScreen title={`${newname} Notes...`}>
      <Link to="/createnote">
        <Button style={{ marginLeft: 10, marginBottom: 6 }} size="lg">
          Create new Note
        </Button>
      </Link>

      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {errorDelete && (
        <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
      )}
      {loadingDelete && <Loading />}
      {loading && <Loading />}
      {/* function chaining in js is crazy lol */}
      {notes &&
        notes
          .filter((note) =>
            showBookmark
              ? note.bookmark === true &&
                note.title.toLowerCase().includes(search.toLowerCase())
              : note.title.toLowerCase().includes(search.toLowerCase())
          )
          .reverse()
          .map((note) => (
            <Accordion key={note._id}>
              <Card style={{ margin: 10 }}>
                <Card.Header
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      color: "black",
                      textDecoration: "none",
                      flex: 1,
                      cursor: "pointer",
                      alignSelf: "center",
                      fontSize: 18,
                      maxWidth: "70%", // Limit title width
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Accordion.Item eventKey={`${note._id}`}></Accordion.Item>
                    <Accordion.Header
                      as="text"
                      variant="link"
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        overflowX: "auto",
                      }}
                    >
                      {note.title}
                    </Accordion.Header>
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: "3px",
                      marginTop: "5px",
                      padding: "1px",
                    }}
                  >
                    <Button size="sm" href={`/notes/${note._id}`}>
                      Summary
                    </Button>
                    <Button size="sm" href={`/note/${note._id}`}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteHandler(note._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Header>
                <Accordion.Body>
                  <Card.Body
                    className="blockquote"
                    style={{
                      maxHeight: "350px", // Set the maximum height of the content
                      overflowY: "auto", // Enable vertical scrolling
                    }}
                  >
                    <h4>
                      <Badge bg="success">Category - {note.category}</Badge>
                    </h4>
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                    <footer className="blockquote-footer">
                      created on -{" "}
                      {new Date(note.createdAt).toLocaleDateString()}
                    </footer>
                  </Card.Body>
                </Accordion.Body>
              </Card>
            </Accordion>
          ))}
    </MainScreen>
  );
};

export default MyNotes;
