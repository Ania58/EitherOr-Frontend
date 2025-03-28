import React, { useState, useEffect } from "react";
import api from "../../api";
import QuestionCard from "./QuestionCard";


const QuestionList = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
               const response = await api.get("/questions/");
               setQuestions(response.data); 
            } catch (error) {
                console.error("Error fetching questions", error);
            }
        };

        fetchQuestions();
    },[]);

    return (
        <div>
            <h2>All Questions</h2>
            {questions.map((question) => (
                <QuestionCard key={question._id} question={question} />
            ))}
        </div>
    );
};

export default QuestionList;
