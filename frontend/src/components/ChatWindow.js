// ChatWindow.js
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_MESSAGES } from "../graphql/queries";
import { SEND_MESSAGE } from "../graphql/mutations";
import { MESSAGE_ADDED } from "../graphql/subscriptions";
import { TextField, Button, Typography } from "@mui/material";

const ChatWindow = () => {
  const { data } = useQuery(GET_MESSAGES);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const { data: subscriptionData } = useSubscription(MESSAGE_ADDED);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (data) setMessages(data.messages);
  }, [data]);

  useEffect(() => {
    if (subscriptionData) {
      setMessages((prev) => [...prev, subscriptionData.messageAdded]);
    }
  }, [subscriptionData]);

  const handleSendMessage = () => {
    sendMessage({ variables: { content: newMessage } });
    setNewMessage("");
  };

  return (
    <div style={{ flex: 1, padding: "20px" }}>
      <Typography variant="h5">Conversación</Typography>
      <div style={{ overflowY: "auto", height: "70%" }}>
        {messages.map((msg) => (
          <div key={msg.id}>
            <Typography>{msg.content}</Typography>
            <Typography variant="caption">{msg.timestamp}</Typography>
          </div>
        ))}
      </div>
      <TextField
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
        fullWidth
      />
      <Button onClick={handleSendMessage} variant="contained">
        Enviar
      </Button>
    </div>
  );
};

export default ChatWindow;
