import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loadingcomp/Loading";
import ErrorMessage from "../ErrorMessage";
import { login } from "../../actions/userActions";
import "./login.css";

const Login = ({ onSignUpClick }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error } = userLogin;
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };
  const userInfo = localStorage.getItem("userInfo");
  useEffect(() => {
    if (userInfo) {
      navigate("/mynotes");
    }
  }, [userInfo, navigate]);

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}
      <label>
        Username:
        <input
          required
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <Button type="submit">Login</Button>

      <span
        onClick={onSignUpClick}
        style={{
          alignSelf: "flex-end",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        New member? Sign up here
      </span>
    </form>
  );
};

export default Login;
