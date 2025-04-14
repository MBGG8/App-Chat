import React, { useState, useEffect, useRef } from "react";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
  List,
  ListItem,
  Paper,
  ListItemText,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const MESSAGES = gql`
  query Messages($channel: String!) {
    messages(channel: $channel) {
      id
      user
      text
      timestamp
    }
  }
`;

const SEND = gql`
  mutation SendMessage($user: String!, $text: String!, $channel: String!) {
    sendMessage(user: $user, text: $text, channel: $channel) {
      id
      text
    }
  }
`;

const SUBSCRIBE = gql`
  subscription MessageSent($channel: String!) {
    messageSent(channel: $channel) {
      id
      user
      text
      timestamp
    }
  }
`;

const channels = ["general", "soporte", "random"];

export default function ChatRoom({ user, onLogout }) {
  const [channel, setChannel] = useState("general");
  const [text, setText] = useState("");
  const { data, refetch } = useQuery(MESSAGES, {
    variables: { channel },
  });
  const [send] = useMutation(SEND);
  const { data: subData } = useSubscription(SUBSCRIBE, {
    variables: { channel },
  });
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef();

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
    }
  }, [data]);

  useEffect(() => {
    if (subData?.messageSent) {
      setMessages((prev) => [...prev, subData.messageSent]);
    }
  }, [subData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (text.trim()) {
      await send({
        variables: { user: user.username, text, channel },
      });
      setText("");
    }
  };

  return (
    <Box
      display="flex"
      height="90vh"
      borderRadius={2}
      boxShadow={3}
      overflow="hidden"
      sx={{ bgcolor: "#e5e5e5" }} // Fondo general del chatbox
    >
      {/* Sidebar canales */}
      <Box width="25%" bgcolor="#f0f0f0" borderRight="1px solid #ccc">
        <Typography p={2} variant="h6">
          Chat
        </Typography>
        <Divider />
        <List>
          {channels.map((ch) => (
            <ListItem
              key={ch}
              button
              selected={ch === channel}
              onClick={() => {
                setChannel(ch);
                refetch({ channel: ch });
              }}
            >
              <ListItemText primary={`# ${ch}`} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box p={2}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={onLogout}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Box>

      {/* Chat window */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        position="relative"
        bgcolor="#ffffff"
      >
        {/* Header */}
        <Box bgcolor="#eeeeee" p={2}>
          <Typography variant="subtitle1">
            Canal: #{channel} — Bienvenido, {user.username}
          </Typography>
        </Box>

        {/* Mensajes */}
        <Box flex={1} p={2} overflow="auto" sx={{ bgcolor: "#fafafa" }}>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              display="flex"
              justifyContent={
                msg.user === user.username ? "flex-end" : "flex-start"
              }
              mb={1}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 1,
                  bgcolor: msg.user === user.username ? "#DCF8C6" : "#ffffff",
                  maxWidth: "70%",
                }}
              >
                <Typography variant="body2">
                  <strong>{msg.user}</strong>
                </Typography>
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>
            </Box>
          ))}
          <div ref={bottomRef} />
        </Box>

        {/* Input */}
        <Box display="flex" p={1} borderTop="1px solid #ccc" bgcolor="#f9f9f9">
          <TextField
            fullWidth
            placeholder="Escribe un mensaje..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            sx={{ bgcolor: "#ffffff", borderRadius: 1 }}
          />
          <IconButton color="primary" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
