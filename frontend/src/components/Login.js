import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography } from "@mui/material";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:4000/graphql", {
        query: `
          mutation {
            login(username: "${username}", password: "${password}") {
              username
              token
            }
          }
        `,
      });
      const { data } = response.data;
      if (data) {
        onLogin(data.login);
      }
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5">Iniciar sesión</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
      />
      <TextField
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button
        onClick={handleLogin}
        variant="contained"
        style={{ marginTop: "10px" }}
      >
        Login
      </Button>
    </div>
  );
};

export default Login;
