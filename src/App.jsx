import React from "react";
import { Routes, Route } from "react-router-dom";
import JoinPage from "./pages/JoinPage.jsx";
import HubPage from "./pages/HubPage.jsx";
import FaqPage from "./pages/FaqPage.jsx";
import DarkModeWidget from "./components/DarkModeWidget.jsx";

export default function App() {
  return (
    <>
      <DarkModeWidget />
      <Routes>
        <Route path="/" element={<JoinPage />} />
        <Route path="/hub" element={<HubPage />} />
        <Route path="/faq" element={<FaqPage />} />
      </Routes>
    </>
  );
}