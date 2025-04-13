// ChatList.js
import React from "react";
import { List, ListItem, Typography } from "@mui/material";

const ChatList = () => (
  <div style={{ borderRight: "1px solid gray", padding: "10px" }}>
    <Typography variant="h6">Chats</Typography>
    <List>
      <ListItem>Chat 1</ListItem>
    </List>
  </div>
);

export default ChatList;
