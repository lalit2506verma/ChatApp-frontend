import React, { useState } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { createRoomService, joinRoomService } from "../services/RoomService";
import useChatContext from "../contexts/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateRoom = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    user: "",
  });

  const { roomId, user, connected, setRoomId, setUser, setConnected } =
    useChatContext();
  const navigate = useNavigate();

  // function to handle input change in the form fields
  const handleFormInputChange = (event) => {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  };

  // function to join the existing chat room
  const joinChat = async () => {
    if (validateForm()) {
      try {
        const room = await joinRoomService(detail.roomId);
        toast.success("Joined Room Successfully");

        // Set the user and room in context
        setUser(detail.user);
        setRoomId(detail.roomId);
        setConnected(true);
        navigate("/chat");
      }
      catch (error) {
        console.log(error);

        if (error.status == 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }
      }
    }
  };

  // function to create a new room
  const createRoom = async () => {
    if (validateForm()) {
      // create Room - API call

      console.log(detail);

      try {
        const response = await createRoomService(detail.roomId);
        toast.success("Room Created Successfully");

        // Set the user and room in context
        setUser(detail.user);
        setRoomId(detail.roomId);
        setConnected(true);

        // User successfully created the room
        // Now navigate to join the room
        navigate("/chat");
      } catch (error) {
        console.log(error);

        if (error.status == 400) {
          toast.error("Room ID already exists");
        } else {
          toast.error("Error creating room");
        }
      }
    }
  };

  // validate form field
  const validateForm = () => {
    if (detail.roomId.trim() === "" || detail.user.trim() === "") {
      toast.error("Invalid Input");
      return false;
    }

    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md flex flex-col gap-4 border-2 rounded-md dark:bg-gray-900 m-5 p-10 ">
        <div>
          <img src={chatIcon} alt="chatIcon" className="w-24 mx-auto" />
        </div>
        {/* Header */}
        <h1 className="text-2xl font-semibold text-center ">
          Create Room / Join Room
        </h1>

        {/* Form */}
        <div>
          <label htmlFor="name" className="block font-medium mb-3">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            name="user"
            placeholder="Enter your name"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleFormInputChange}
            value={detail.user}
          />
        </div>

        <div>
          <label htmlFor="roomId" className="block font-medium mb-3">
            Room ID / New Room ID
          </label>
          <input
            id="roomId"
            type="text"
            name="roomId"
            placeholder="ABC-123-XYZ"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleFormInputChange}
            value={detail.roomId}
          />
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-3 py-2 dark:bg-blue-500 dark:hover:bg-blue-800 rounded-lg"
            onClick={joinChat}
          >
            Join Room
          </button>
          <button
            className="px-3 py-2 dark:bg-orange-500 dark:hover:bg-orange-800 rounded-lg"
            onClick={createRoom}
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateRoom;
