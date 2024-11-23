import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./Register.css";
import Loading from "../Loadingcomp/Loading";
import ErrorMessage from "../ErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";

const Register = ({ activeModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error } = userRegister;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      dispatch(register(username, password, email));
    } catch (error) {
      console.log("unable to sign in due to " + error);
    }
  };

  return (
    <form className="register-form p3 " onSubmit={handleSubmit}>
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      <div>
        {loading && <Loading />}
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
          email:
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
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm password:
          <input
            type="password"
            name="confirPpassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
      </div>

      <br />
      <Button type="submit" variant="primary" size="lg">
        Register
      </Button>
    </form>
  );
};

export default Register;
