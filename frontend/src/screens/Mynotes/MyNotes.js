import React from "react";
import MainScreen from "../../components/MainScreen/MainScreen";
import { Button, Card, Accordion, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listNotes } from "../../actions/noteActions";
import Loading from "../../components/Loadingcomp/Loading";
import "./MyNotes.css";

const MyNotes = () => {
  const navigate = useNavigate();
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      console.log(id);
    }
  };
  const dispatch = useDispatch();
  const noteList = useSelector((state) => state.noteList);
  const { loading, error, notes } = noteList;

  const userInfo = localStorage.getItem("userInfo");
  useEffect(() => {
    if (userInfo) {
      dispatch(listNotes());
      console.log("dasdsd");
    }
  }, [dispatch, userInfo]);

  return (
    <MainScreen title={`Welcome Back ..`}>
      <Link to="/createnote">
        <Button style={{ marginLeft: 10, marginBottom: 6 }} size="lg">
          Create new Note
        </Button>
      </Link>
      {loading && <Loading />}
      {notes?.map((note) => (
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
                <h4>{note.content}</h4>
                <footer className="blockquote-footer">created on date</footer>
              </Card.Body>
            </Accordion.Body>
          </Card>
        </Accordion>
      ))}
    </MainScreen>
  );
};

export default MyNotes;
