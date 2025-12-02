import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [user, setUser] = useState(""); 
  const [connected, setConnected] = useState(false);

  return (
    <ChatContext.Provider value={{ roomId, user, connected, setRoomId, setUser, setConnected }}>
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => {
  return useContext(ChatContext);
};

export default useChatContext;