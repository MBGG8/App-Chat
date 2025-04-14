import React, { useState } from "react";
import { Container } from "@mui/material";
import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Container>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <ChatRoom user={user} onLogout={handleLogout} />
      )}
    </Container>
  );
};

export default App;
