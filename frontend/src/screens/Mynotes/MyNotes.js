import React from "react";
import MainScreen from "../../components/MainScreen/MainScreen";
import { Button, Card, Accordion, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listNotes } from "../../actions/noteActions";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loadingcomp/Loading";
import ReactMarkdown from "react-markdown";
import { deleteNoteAction } from "../../actions/noteActions";
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

  const noteCreate = useSelector((state) => state.noteCreate);
  const { success: successCreate } = noteCreate;

  const noteUpdate = useSelector((state) => state.noteUpdate);
  const { success: successUpdate } = noteUpdate;

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteNoteAction(id));
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
    successCreate,
    successUpdate,
    navigate,
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
      {notes &&
        notes
          .filter((filteredNote) =>
            filteredNote.title.toLowerCase().includes(search.toLowerCase())
          )
          .reverse()
          .map((note) => (
            <Accordion key={note._id}>
              <Card style={{ margin: 10 }}>
                <Card.Header style={{ display: "flex" }}>
                  <span
                    style={{
                      color: "black",
                      textDecoration: "none",
                      flex: 1,
                      cursor: "pointer",
                      alignSelf: "center",
                      fontSize: 18,
                    }}
                  >
                    <Accordion.Item eventKey="${note._id}"></Accordion.Item>
                    <Accordion.Header as="text" variant="link">
                      {note.title}
                    </Accordion.Header>
                  </span>
                  <div>
                    <Button href={`/note/${note._id}`}>Edit</Button>

                    <Button
                      variant="danger"
                      className="mx-2"
                      onClick={() => {
                        deleteHandler(note._id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Header>
                <Accordion.Body>
                  <Card.Body className="blockquote">
                    <h4>
                      <Badge bg="success">Category - {note.category}</Badge>
                    </h4>
                    {/* <h4>{note.content}</h4> */}
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                    <footer className="blockquote-footer">
                      created on - {new Date().toLocaleDateString()}
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
