import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api";
import GoBackButton from '../buttons/GoBackButton';
import Spinner from '../common/Spinner';


const CreateQuestion = () => {

    const [optionOne, setOptionOne] = useState("");
    const [optionTwo, setOptionTwo] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChangeOne = (e) => {
        setOptionOne(e.target.value);
    };

    const handleChangeTwo = (e) => {
        setOptionTwo(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const questionData = {
            optionOne,
            optionTwo,
          };
   
        try {
            setLoading(true);
            const response = await api.post('/questions/create', questionData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              });
            console.log('Question created:', response.data);

            const createdId = response.data._id;

            setOptionOne('');
            setOptionTwo('');
            setMessage("Question created successfully!");
            setTimeout(() => {
                navigate(`/questions/${createdId}`); 
              }, 1500);
        } catch (error) {
            console.error('Error creating question:', error);
        } finally {
            setLoading(false);
        };
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <GoBackButton />
            <h1 className="text-2xl font-bold text-center mb-4">Create Your Either/Or Question</h1>
            <h2 className="text-lg text-gray-700 text-center mb-6">Would you rather...</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Write your option one:</label>
                    <input
                        type="text"
                        value={optionOne}
                        onChange={handleChangeOne}
                        required
                        className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Write your option two:</label>
                    <input
                        type="text"
                        value={optionTwo}
                        onChange={handleChangeTwo}
                        required
                        className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    {loading ? <Spinner /> : "Create Question"}
                </button>
                {message && <p className="text-center text-green-600 font-medium mt-2">{message}</p>}
            </form>
        </div>
    )
};

export default CreateQuestion;