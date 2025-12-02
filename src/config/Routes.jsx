import React from 'react';
import App from "../App.jsx";
import { Route, Routes } from 'react-router';
import ChatPage from '../components/ChatPage.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}

export default AppRoutes;