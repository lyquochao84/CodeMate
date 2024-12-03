"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import CodingProblemPage from "@/app/problems/[title]/page";
import { ACTIONS } from "@/lib/actionsSocket";
import { initSocket } from "@/config/socket_io";
import { Socket } from "socket.io-client";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/interfaces";

const RoomCodingPage = () => {
  const params = useParams();

  const [roomUsers, setRoomUsers] = useState<User[]>([]);
  const [liveCode, setLiveCode] = useState<string>("");

  const title = Array.isArray(params.title) ? params.title[0] : params.title; // Ensure title is a string
  const id = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId; // Ensure roomId is a string

  const { userNickname } = useAuth();

  const socketRef = useRef<Socket | null>(null);
  const codeRef = useRef<string | null>(null);
  
  // Listen to all the socket events
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
          (data: { users: User[]; userNickname: string; socketId: string }) => {
            const { users, userNickname, socketId } = data;
            // alert(`${userNickname} has joined the room`);

            setRoomUsers(users);

            // Sync the latest code for the newest user
            socketRef.current?.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              socketId,
            });
          }
        );

        // Listen to real-time code change
        socketRef.current.on(ACTIONS.CHANGE_CODE, (data: { code: string }) => {
          const { code } = data;
          setLiveCode(code);
          console.log(liveCode);
        });

        // Listen to the even when user left the room
        socketRef.current.on(
          ACTIONS.LEAVE_ROOM,
          (data: { socketId: string; username: string }) => {
            const { socketId } = data;

            // alert(`${username} left the room`);

            setRoomUsers((prev) => {
              return prev.filter((client) => client.socketId !== socketId);
            });
          }
        );
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current && socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED_ROOM);
        socketRef.current.off(ACTIONS.LEAVE_ROOM);
        socketRef.current.off(ACTIONS.CHANGE_CODE); 
      }
    };
  }, [id, userNickname]);

  return (
    <div>
      <h1>Room Coding Page</h1>
      <p>Room ID: {id || "No Room ID"}</p>
      <CodingProblemPage
        liveCode={liveCode}
        codeRef={codeRef}
        socketRef={socketRef}
        roomUsers={roomUsers}
        params={{ title, id }}
      />
    </div>
  );
};

export default RoomCodingPage;
