"use client";
import React, { FormEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function RoomID() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const createNewRoom = (e: FormEvent) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room_ID & Username is required");
      return;
    }
    navigator.clipboard.writeText(roomId);

    router.push(`/Home/${roomId}`);
    toast.success("Room Created Successfully");
  };

  return (
    <>
      <div className="homePageWrapper">
        <div className="formWrapper">
          <h1 className="text-3xl font-bold p-4 m-2 mt-0 ml-0 pl-0">
            Collab Code Editor
          </h1>
          <h4 className="mainLabel">Paste invitation ROOM ID</h4>
          <div className="inputGroup ">
            <input
              type="text"
              className="inputBox text-black"
              placeholder="ROOM ID"
              onChange={(e) => setRoomId(e.target.value.trim())}
              value={roomId}
              // onKeyUp={handleInputEnter}
            />
            <input
              type="text"
              className="inputBox text-black"
              placeholder="USERNAME"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              // onKeyUp={handleInputEnter}
            />

            <button className="btn joinBtn text-black" onClick={joinRoom}>
              Join
            </button>
            <span className="createInfo">
              If you don't have an invite then create &nbsp ;
              <a onClick={createNewRoom} href="" className="createNewBtn">
                new room
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoomID;
