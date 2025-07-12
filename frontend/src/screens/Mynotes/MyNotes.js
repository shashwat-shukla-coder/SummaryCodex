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
  const [bookmarkStatus, setBookmarkStatus] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);

  useEffect(() => {
    if (notes) {
      const initialStatus = notes.reduce((acc, note) => {
        acc[note._id] = note.bookmark || false;
        return acc;
      }, {});
      setBookmarkStatus(initialStatus);
    }
  }, [notes]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteNoteAction(id));
    }
  };

  const downloadNote = (title, content) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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

  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    setCurrentUtterance(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const togglePause = () => {
    if (window.speechSynthesis.speaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  const restartSpeech = () => {
    if (currentUtterance) {
      window.speechSynthesis.cancel();
      const newUtterance = new SpeechSynthesisUtterance(currentUtterance.text);
      newUtterance.lang = "en-US";
      setCurrentUtterance(newUtterance);
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

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
                      maxWidth: "70%",
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
                      flexDirection: "column",
                      gap: "5px",
                      justifyContent: "space-around",
                    }}
                  >
                    {/* Top Row:*/}
                    <div
                      style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}
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

                    {/* Bottom Row*/}
                    <div
                      style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}
                    >
                      {/* speak (Txt to Speech) */}
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => speakText(note.content)}
                      >
                        <i className="bi bi-megaphone"></i>
                      </Button>
                      {/* pause/resume */}
                      <Button
                        variant="light"
                        size="sm"
                        onClick={togglePause}
                        disabled={!isSpeaking}
                      >
                        {isPaused ? (
                          <i className="bi bi-play-fill"></i>
                        ) : (
                          <i className="bi bi-pause-circle-fill"></i>
                        )}
                      </Button>
                      {/* Restart button */}
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => {
                          if (currentUtterance) {
                            window.speechSynthesis.cancel();
                            const newUtterance = new SpeechSynthesisUtterance(
                              currentUtterance.text
                            );
                            newUtterance.lang = "en-US";
                            setCurrentUtterance(newUtterance);
                            setIsSpeaking(false);
                            setIsPaused(false);
                          }
                        }}
                        disabled={!currentUtterance}
                      >
                        <i className="bi bi-arrow-counterclockwise"></i>
                      </Button>
                     { /*download button*/}
                      <Button
                        variant="dark"
                        size="sm"
                        onClick={() => downloadNote(note.title, note.content)}
                      >
                        <i className="bi bi-download " ></i>
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Accordion.Body>
                  <Card.Body
                    className="blockquote"
                    style={{
                      maxHeight: "350px",
                      overflowY: "auto",
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
