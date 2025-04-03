import React from "react";
import { useNavigate } from "react-router-dom";

const QuestionCard = ({question}) => {
    const navigate = useNavigate();

    return (
        <div className="p-6 border rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300 w-full max-w-2xl mx-auto mb-6">
            <h3 className="text-2xl font-bold mb-2">Would you rather:</h3>
            <p className="text-lg text-gray-700 mb-4">{question.optionOne} OR {question.optionTwo}</p>
            <button onClick={() =>navigate(`/questions/${question._id}`)} className="px-6 py-2 bg-green-500 text-white text-lg rounded hover:bg-green-600 transition-colors duration-300 cursor-pointer">
                See Details
            </button>
        </div>
    );
};

export default QuestionCard;