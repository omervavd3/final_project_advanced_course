import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import HomePage from "./components/HomePage";
import EditUser from "./components/EditUser";
import EditPost from "./components/EditPost";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="889017428648-comlat45ro2rsvh8lsq157n23g89t72s.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/editUser" element={<EditUser />} />
          <Route path="/editPost/:id" element={<EditPost />} />
          <Route
            path="*"
            element={
              <div>
                <h1>Not Found</h1>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
