import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api";
import QuestionCard from "./QuestionCard";

const sortLabels = {
    all: "📋 All Questions",
    newest: "🆕 Newest",
    popular: "🔥 Most Popular",
    weird: "😵‍💫 Weirdest",
  };

const QuestionList = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const sortBy = new URLSearchParams(location.search).get("sortBy");
        const fetchQuestions = async () => {
            try {
               setLoading(true);
               const response = await api.get(`/questions${sortBy ? `?sortBy=${sortBy}` : ""}`);
               setQuestions(response.data); 
            } catch (error) {
                console.error("Error fetching questions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    },[location.search]);

    const sortBy = new URLSearchParams(location.search).get("sortBy") || "all";

    return (
        <div>
            <h2>All Questions</h2>
            <p>
                🧭 Currently sorted by: <strong>{sortLabels[sortBy]}</strong>
            </p>

            {loading ? (
                <p>⏳ Loading questions...</p>
            ) : questions.length === 0 ? (
                <p>😢 No questions found. Be the first to create one!</p>
            ) : (
            questions.map((question) => (
                <QuestionCard key={question._id} question={question} />
            ))
            )}
        </div>
    );
};

export default QuestionList;
