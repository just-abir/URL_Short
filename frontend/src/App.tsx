import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";

const App = () => {
  const [themeMode, setthemeMode] = useState<boolean>(false);

  return (
    <div
      className={`
        min-h-screen
        transition-all duration-500
        ${
          themeMode
            ? "bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white"
            : "bg-gradient-to-br from-violet-50 via-white to-cyan-50 text-slate-900"
        }
      `}
    >
      <Navbar themeMode={themeMode} setthemeMode={setthemeMode} />

      {/* Navbar height = 64px */}
      <main className="min-h-screen pt-16">
        <Routes>
          <Route path="/" element={<Home themeMode={themeMode} />} />
          <Route
            path="/dashboard"
            element={<Dashboard themeMode={themeMode} />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
