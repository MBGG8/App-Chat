import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
} from "@mui/material";

const REGISTER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
  });

  const [register] = useMutation(REGISTER);
  const [login] = useMutation(LOGIN);

  const validate = () => {
    let errors = { username: "", password: "" };
    let isValid = true;

    if (!form.username.trim()) {
      errors.username = "El nombre de usuario es obligatorio";
      isValid = false;
    }

    if (!form.password.trim()) {
      errors.password = "La contraseña es obligatoria";
      isValid = false;
    } else if (form.password.length < 4) {
      errors.password = "La contraseña debe tener al menos 4 caracteres";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setError("");
    const mutation = mode === "login" ? login : register;

    try {
      const { data } = await mutation({ variables: form });
      const payload = data.login || data.register;
      localStorage.setItem("token", payload.token);
      localStorage.setItem("user", JSON.stringify(payload.user));
      onLogin(payload.user);
    } catch (err) {
      const msg =
        err.graphQLErrors?.[0]?.message ||
        "Error inesperado. Intenta nuevamente.";
      setError(msg);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400, p: 3, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom color="primary">
            {mode === "login" ? "Iniciar sesión" : "Registrarse"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            error={Boolean(fieldErrors.username)}
            helperText={fieldErrors.username}
          />

          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
          />

          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            {mode === "login" ? "Entrar" : "Registrarse"}
          </Button>

          <Button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
              setFieldErrors({ username: "", password: "" });
            }}
            fullWidth
            sx={{ mt: 1 }}
          >
            {mode === "login"
              ? "¿No tienes cuenta? Registrarse"
              : "¿Ya tienes cuenta? Iniciar sesión"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
