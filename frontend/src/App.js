import React, { useState } from "react";
import Login from "./components/Login";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";

const App = () => {
  const [user, setUser] = useState(null);

  return user ? (
    <div style={{ display: "flex", height: "100vh" }}>
      <ChatList />
      <ChatWindow />
    </div>
  ) : (
    <Login onLogin={(userData) => setUser(userData)} />
  );
};

export default App;
