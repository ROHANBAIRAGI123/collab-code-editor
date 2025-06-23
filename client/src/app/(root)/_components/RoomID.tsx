"use client";
import { useState } from "react";

function RoomID() {
     const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');


  return (
  <>
    <div className="homePageWrapper">
            <div className="formWrapper">
                
                <h1 className="text-3xl font-bold p-4 m-2 mt-0 ml-0 pl-0">Collab Code Editor</h1>
                <h4 className="mainLabel">Paste invitation ROOM ID</h4>
                <div className="inputGroup ">
                    <input
                        type="text"
                        className="inputBox text-black"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
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
                    <button className="btn joinBtn text-black">
                        Join
                    </button>
                    <span className="createInfo">
                        If you don't have an invite then create &nbsp;
                        <a
                            // onClick={createNewRoom}
                            href=""
                            className="createNewBtn"
                        >
                            new room
                        </a>
                    </span>
                </div>
            </div>
        </div>
  </>
  )
}

export default RoomID;