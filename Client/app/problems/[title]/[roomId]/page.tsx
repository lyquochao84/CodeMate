"use client";

import { useParams } from "next/navigation";
import CodingProblemPage from "../page";
import { formatURL } from "@/lib/formatURL";

const RoomCodingPage = () => {
  const params = useParams(); 
  const title = Array.isArray(params.title) ? params.title[0] : params.title; // Ensure title is a string
  const id = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId; // Ensure roomId is a string

  if (!title) {
    return <p>Error: Problem title is missing</p>;
  }

  return (
    <div>
      <h1>Room Coding Page</h1>
      <p>Problem Title: {formatURL(title)}</p>
      <p>Room ID: {id || "No Room ID"}</p>
      <CodingProblemPage params={{ title, id }} /> 
    </div>
  );
};

export default RoomCodingPage;
