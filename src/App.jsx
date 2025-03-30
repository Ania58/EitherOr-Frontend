import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MainPage from "./pages/MainPage";
import CreateQuestion from "./components/questions/CreateQuestion";
import QuestionList from "./components/questions/QuestionList";
import QuestionDetails from "./components/questions/QuestionDetails";
import EditQuestion from "./components/questions/EditQuestion";
import DeleteQuestion from "./components/questions/DeleteQuestion";
import Login from "./components/firebaseUser/Login";
import Register from "./components/firebaseUser/Register";
import ProtectedRoute from "./components/firebaseUser/ProtectedRoute";



function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/questions" element={<QuestionList />} />
        <Route path="/questions/create" element={<ProtectedRoute><CreateQuestion /></ProtectedRoute>} />
        <Route path="/questions/:id" element={<QuestionDetails />} />
        <Route path="/questions/:id/edit" element={<ProtectedRoute><EditQuestion /></ProtectedRoute>} />
        <Route path="/questions/:id/delete" element={<ProtectedRoute><DeleteQuestion /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
      </Routes>

      <Footer />
    </>
  );
}

export default App;

