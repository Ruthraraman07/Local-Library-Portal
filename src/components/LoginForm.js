    // LoginForm.js
    import React, { useState } from "react";
    import { Button, FormGroup, InputGroup, Card, Icon } from "@blueprintjs/core";
    import axios from "axios";
    import { useAuth } from '../context/AuthContext'; // Import useAuth

    const LoginForm = ({ setShowLogin, onLoginSuccess, setShowRegister }) => {
      const [form, setForm] = useState({
        email: "",
        password: "",
      });
      const { updateAuth } = useAuth(); // Get the updateAuth function

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post("/api/auth/login", form);
          const { token } = response.data;

          // Update the authentication context
          updateAuth({
            token: token,
            user: null, // You might want to fetch user data here
          });

          alert("Login successful!");
          onLoginSuccess();
        } catch (error) {
          console.error("Login error:", error); // Log the entire error object

          let errorMessage = "Login failed.";

          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);

            if (error.response.data && error.response.data.error) {
              errorMessage = "Login failed: " + error.response.data.error;
            } else {
              errorMessage = `Login failed: Server error (Status ${error.response.status})`;
            }
          } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", error.request);
            errorMessage = "Login failed: No response from server.";
          } else {
            // Something happened in setting up the request that triggered an Error
            errorMessage = "Login failed: " + error.message;
          }

          alert(errorMessage);
        }
      };

      return (
        <Card className="form-card">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
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
            <Button type="submit" intent="primary">Login</Button>
            <button
              className="close-button"
              onClick={() => setShowLogin(false)}
              aria-label="Close"
            >
              <Icon icon="cross" />
            </button>
            <p>
              You agree to our terms and conditions.{" "}
              <Button onClick={() => { setShowLogin(false); setShowRegister(true); }}>Create new account</Button>
            </p>
          </form>
        </Card>
      );
    };

    export default LoginForm;
    