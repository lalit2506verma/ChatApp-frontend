import React, { useRef, useState, useEffect } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../contexts/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { baseURL } from "../config/AxiosHelper";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { getMessages } from "../services/RoomService";
import { timeAgo } from "../config/Helper";

const ChatPage = () => {
  const { roomId, user, connected, setConnected, setRoomId, setUser} = useChatContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [roomId, user, connected]);

  const [messages, SetMessages] = useState([]);
  const [input, SetInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  console.log(messages);
  

  // Loading the messages from server
  useEffect(() => {
    async function loadMessages() {

      try {
        const messages = await getMessages(roomId);
        // console.log(messages);

        // set the messages to state
        SetMessages(messages);
        
      } catch (error) {
        console.log(error);
        
      }
    }

    if (connected) {
      loadMessages();
    }
    
  }, [roomId])

  // building connection with the websocket - stompClient
  useEffect(() => {
    // code to build connection will go here

    const connectWebSocket = () => {
      // SoctJS
      const socket = new SockJS(`${baseURL}/chat`);

      const client = Stomp.over(socket);

      client.connect({}, () => {
        setStompClient(client);

        toast.success("Connected");
        // subscribe to the room
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log(message);
          const receivedMessage = JSON.parse(message.body);

          SetMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }
  }, [roomId]);

  //send message function
  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      console.log(input);

      const message = {
        sender: user,
        content: input,
        roomId: roomId,
      }

      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
      SetInput("");
    }
  };

  // handle logout
  function handleLogout() {
    stompClient.disconnect();
    setConnected(false);
    setRoomId(null);
    setUser(null);
    navigate("/");
    
  }

  // auto scroll to bottom when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="">
      {/* Header */}
      <header className="flex place-content-around items-center p-2 dark:bg-gray-600 fixed w-full h-16">
        {/* Room Name */}
        <div>
          <h1 className="text-xl font-semibold">
            {" "}
            Room : <span>{roomId}</span>
          </h1>
        </div>

        {/* User Name */}
        <div>
          <h1 className="text-xl font-semibold">
            {" "}
            User : <span>{user}</span>
          </h1>
        </div>

        {/* Leave Room Button */}
        <div className="m-2 flex justify-center">
          <button onClick={ handleLogout } className="dark:bg-red-500 dark:hover:bg-red-700 p-2 rounded-lg">
            Leave Room
          </button>
        </div>
      </header>

      {/* Message Area */}
      <main ref={chatBoxRef} className="py-16 w-2/3 dark:bg-slate-700 mx-auto h-screen overflow-auto no-scrollbar">
        <div className="message_container ">
          {/* Messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex mx-2 ${
                message.sender === user ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`my-2 ${
                  message.sender === user ? "bg-blue-500" : "bg-amber-500"
                } py-2 px-5 rounded-lg max-w-lg w-fit wrap-break-word whitespace-normal`}
              >
                <div className="flex gap-2">
                  {/* profile image */}
                  <img
                    className="h-10 w-10"
                    src=" https://avatar.iran.liara.run/public"
                    alt=""
                  />

                  {/* message content */}
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">{message.sender}</p>
                    <p>{message.content}</p>
                    <p className="text-xs text-gray-300">{ timeAgo(message.timeStamp) }</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input container */}
      <div className="fixed bottom-2 w-full h-16">
        <div className=" flex items-center justify-between h-full w-1/2 px-10 mx-auto gap-4 dark:bg-gray-600 rounded-lg">
          <input
            id="message"
            className="dark:border-gray-700 dark:bg-gray-900 px-5 py-2 rounded-lg w-full focus:outline-none"
            type="text"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => SetInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}  
          />

          {/* Input message container */}
          <div className="flex gap-2">
            <button className="dark:bg-purple-500 p-3 rounded-full flex items-center justify-center dark:hover:bg-purple-700">
              <MdAttachFile size={20} />
            </button>

            <button onClick={ sendMessage } className="dark:bg-green-500 p-3 rounded-full flex items-center justify-center dark:hover:bg-green-700">
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
