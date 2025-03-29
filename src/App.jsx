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

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/questions" element={<QuestionList />} />
        <Route path="/questions/create" element={<CreateQuestion />} />
        <Route path="/questions/:id" element={<QuestionDetails />} />
        <Route path="/questions/:id/edit" element={<EditQuestion />} />
        <Route path="/questions/:id/delete" element={<DeleteQuestion />} />
        
      </Routes>

      <Footer />
    </>
  );
}

export default App;

