"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import CodingProblemPage from "../page";
import { formatURL } from "@/lib/formatURL";
import { ACTIONS } from "@/lib/actionsSocket";
import { initSocket } from "@/config/socket_io";
import { Socket } from "socket.io-client";
import { useAuth } from "@/hooks/useAuth";

const RoomCodingPage = () => {
  const params = useParams();
  const router = useRouter();
  const [roomUsers, setRoomUsers] = useState<string[]>([]);
  const title = Array.isArray(params.title) ? params.title[0] : params.title; // Ensure title is a string
  const id = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId; // Ensure roomId is a string
  const { userNickname } = useAuth();

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
  
      if (socketRef.current) {
        // Listen to the event join room
        socketRef.current.emit(ACTIONS.JOIN_ROOM, {
          id,
          userNickname,
        });
  
        // Listen to the event user joined room
        socketRef.current.on(
          ACTIONS.JOINED_ROOM,
          (data: { users: string[]; userNickname: string; socketId: string }) => {
            const { users, userNickname, socketId } = data;
  
            alert(`${userNickname} has joined the room`);
            setRoomUsers(users);
          }
        );
      }
    };
  
    init();
  
    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.JOINED_ROOM);
      }
    };
  }, []);
  
  console.log(roomUsers);

  return (
    <div>
      <h1>Room Coding Page</h1>
      <p>Problem Title: {formatURL(title)}</p>
      <p>Room ID: {id || "No Room ID"}</p>
      <CodingProblemPage roomUsers={roomUsers} params={{ title, id }} />
    </div>
  );
};

export default RoomCodingPage;
