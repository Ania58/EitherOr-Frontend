import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();

    const handleEdit = () => {
    navigate(`/questions/${id}/edit`);
    };

    const handleDelete = () => {
        navigate(`/questions/${id}/delete`)
    };

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
    };

    if (!question) return <p>Loading...</p>;

    const totalVotes = question.votesOptionOne.length + question.votesOptionTwo.length;
    const percentOptionOne = ((question.votesOptionOne.length / totalVotes) * 100).toFixed(1);
    const percentOptionTwo = ((question.votesOptionTwo.length / totalVotes) * 100).toFixed(1);

    return (
        <div>
          <h1>Would you rather...</h1>
          <p>{question.optionOne} OR {question.optionTwo}</p>
          {!hasVoted ? (
            <>
            <button onClick={() => setSelectedOption("optionOne")} className={selectedOption === "optionOne" ? "selected" : ""}>{question.optionOne}</button>
            <button onClick={() => setSelectedOption("optionTwo")} className={selectedOption === "optionTwo" ? "selected" : ""}>{question.optionTwo}</button>
            <button onClick={handleVote} disabled={!selectedOption}>Submit Vote</button>
            </>
          ) : (
            resultsVisible && (
                <div>
                    <p>You chose: <strong>{question[selectedOption]}</strong></p>
                    <p>{question.optionOne}: {percentOptionOne}% ({question.votesOptionOne.length} votes)</p>
                    <p>{question.optionTwo}: {percentOptionTwo}% ({question.votesOptionTwo.length} votes)</p>
                </div>
            )
          )}
          <button onClick={handleEdit}>Edit Question</button>
          <button onClick={handleDelete}>Delete Question</button>
        </div>
      );
};

export default QuestionDetails;