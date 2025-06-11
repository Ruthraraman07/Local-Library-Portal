// RegisterForm.js
import React, { useState } from "react";
import { Button, FormGroup, InputGroup, Card, Icon } from "@blueprintjs/core";
import axios from "axios";

const RegisterForm = ({ setShowRegister, setShowLogin }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/register", form);
      alert("Registration successful!");
      setShowRegister(false);
    } catch (error) {
      let errorMessage = "Registration failed.";

      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = "Registration failed: " + error.response.data.error;
      } else if (error.message) {
        errorMessage = "Registration failed: " + error.message;
      } else {
        errorMessage = "Registration failed: An unexpected error occurred.";
      }

      alert(errorMessage);
    }
  };

  return (
    <Card className="form-card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup label="Name">
          <InputGroup
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </FormGroup>
        <FormGroup label="Email">
          <InputGroup
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </FormGroup>
        <FormGroup label="Password">
          <InputGroup
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </FormGroup>
        <Button type="submit" intent="primary">Register</Button>
        <button
          className="close-button"
          onClick={() => setShowRegister(false)}
          aria-label="Close"
        >
          <Icon icon="cross" />
        </button>
        <p>
          Already have an account?{" "}
          <Button onClick={() => { setShowRegister(false); setShowLogin(true); }}>Login</Button>
        </p>
      </form>
    </Card>
  );
};

export default RegisterForm;
