import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./Register.css";
import Loading from "../Loadingcomp/Loading";
import ErrorMessage from "../ErrorMessage";
import SuccessMessage from "../successMessage/SuccessMessage";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";

const Register = ({ activeModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error } = userRegister;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await dispatch(register(username, password, email));
      setShowMessage(true);
      await dispatch(login(username, password));
      setTimeout(() => setShowMessage(false), 2000);
      setTimeout(() => {
        activeModal(null);
        navigate("/mynotes");
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form className="register-form p3" onSubmit={handleSubmit}>
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {showMessage && <SuccessMessage message="Registration successful!" />}
      {loading && <Loading />}

      <div className="closebox">
        <span
          style={{ color: "black", fontSize: "20px", cursor: "pointer" }}
          onClick={() => activeModal(null)}
        >
          <b>X</b>
        </span>
      </div>

      <label>
        Username:
        <input
          required
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <br />

      <label>
        Email:
        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />

      <label>
        Password:
        <input
          required
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />

      <label>
        Confirm Password:
        <input
          required
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </label>
      <br />

      <Button type="submit" variant="primary" size="lg">
        Register
      </Button>
    </form>
  );
};

export default Register;
