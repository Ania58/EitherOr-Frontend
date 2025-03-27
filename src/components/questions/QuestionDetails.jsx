import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from "../../api";


const QuestionDetails = () => {
    const [question, setQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [hasVoted, setHasVoted] = useState(false);
    const [resultsVisible, setResultsVisible] = useState(false);
    const [comments, setComments] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await api.get(`/questions/${id}`);
                setQuestion(response.data);  
                setComments(response.data.comments || []);
            } catch (error) {
                console.error("Failed to fetch question", error);
            };
        };

        fetchQuestion();
    },[id]);

    const handleVote = async () => {

        if (!selectedOption) return;

        try {
            const response = await api.post(`/questions/${id}/vote`, {
                option: selectedOption,
                voterId: "dummy123" 
              });
            setHasVoted(true);
            setResultsVisible(true);

            const updated = await api.get(`/questions/${id}`);
            setQuestion(updated.data);

        } catch (error) {
            console.error("Failed to cast a vote", error);
        }
    }

    if (!question) return <p>Loading...</p>;

    return (
        <div>
          <h1>Would you rather...</h1>
          <p>{question.optionOne} OR {question.optionTwo}</p>
          <button onClick={() => setSelectedOption("optionOne")}>{question.optionOne}</button>
          <button onClick={() => setSelectedOption("optionTwo")}>{question.optionTwo}</button>
          <button onClick={handleVote} disabled={!selectedOption || hasVoted}>Submit Vote</button>

        </div>
      );
};

export default QuestionDetails;