"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import socket from "@/config/socket_io";
import CodingProblemPage from "@/app/problems/[title]/page";
import { useAuth } from "@/hooks/useAuth";
import { useCoding } from "@/hooks/useCoding";
import toast, { Toaster } from "react-hot-toast";

const RoomCodingPage = () => {
  const params = useParams();
  const { username } = useAuth();
  const { setLanguage, setCode } = useCoding();

  const [roomUsers, setRoomUsers] = useState<string[]>(() => []);

  const title = Array.isArray(params.title) ? params.title[0] : params.title; // Ensure title is a string
  const id = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId; // Ensure roomId is a string

  useEffect(() => {
    if (!id || !username) return;

    // Join the room
    socket.emit("join-room", { roomId: id, username: username });

    // Listen for user updates
    socket.on("updating-user-list", ({ userList }) => {
      setRoomUsers(userList);
    });

    socket.on("change-language", ({ languageUsed }) => {
      setLanguage(languageUsed);
    });

    socket.on("change-code", ({ code }) => {
      setCode(code);
    });

    // Notify when a new user joins
    socket.on("new-user-joined", ({ username }) => {
      toast.success(`${username} has joined the room.`);
    });

    // Handle member left
    socket.on("member-left", ({ username }) => {
      toast(`${username} has left the room.`);
    });

    // Clean up event listeners on unmount
    return () => {
      socket.emit("leave-room", { roomId: id });
      socket.off("updating-user-list");
      socket.off("new-user-joined");
      socket.off("member-left");
    };
  }, [id, username, setCode, setLanguage]);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <CodingProblemPage roomUsers={roomUsers} params={{ title, id }} />
    </div>
  );
};

export default RoomCodingPage;
