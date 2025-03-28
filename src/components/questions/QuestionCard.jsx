import React from "react";
import { useNavigate } from "react-router-dom";

const QuestionCard = ({question}) => {
    const navigate = useNavigate();

    return (
        <div className="question-card">
            <h3>Would you rather:</h3>
            <p>{question.optionOne} OR {question.optionTwo}</p>
            <button onClick={() =>navigate(`/questions/${question._id}`)}>See Details</button>
        </div>
    );
};

export default QuestionCard;