import React from "react";
import styles from "./chatWindow.module.css";
import { ChatWindowProps } from "@/types/interfaces";

const ChatWindow: React.FC<ChatWindowProps> = ({ roomUsers }): JSX.Element => {
  return (
    <div className={styles.chat_window}>
      <ul>
        {roomUsers.map((user, index) => (
          <li key={index}>{user.username}</li> 
        ))}
      </ul>
    </div>
  );
};

export default ChatWindow;
