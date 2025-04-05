import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../api";
import GoBackButton from '../buttons/GoBackButton';
import Spinner from '../common/Spinner';

const EditQuestion = () => {
    const [ optionOne, setOptionOne ] = useState("");
    const [ optionTwo, setOptionTwo ] = useState("");
    const [ updateOptionOne, setUpdateOptionOne ] = useState("");
    const [ updateOptionTwo, setUpdateOptionTwo ] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await api.get(`/questions/${id}`);
                setOptionOne(response.data.optionOne);
                setOptionTwo(response.data.optionTwo);
                setUpdateOptionOne(response.data.optionOne); 
                setUpdateOptionTwo(response.data.optionTwo);
            } catch (error) {
                console.error("Failed to fetch question", error);
            }
        };

        fetchQuestion();
    },[id]);


    const handleChangeQuestionOne = (e) => {
        setUpdateOptionOne(e.target.value);
    };

    const handleChangeQuestionTwo = (e) => {
        setUpdateOptionTwo(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const question = {
            optionOne: updateOptionOne,
            optionTwo: updateOptionTwo,
          };

        try {
            const response = await api.put(`/questions/${id}/edit`, question, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              });
              setSuccessMessage("✅ Question updated!");
              setTimeout(() => {
                navigate(`/questions/${id}`);
              }, 1500);
            setUpdateOptionOne("");
            setUpdateOptionTwo("");
        } catch (error) {
            console.error("Failed to update question", error);
        } finally {
            setLoading(false);
        };
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <GoBackButton />
            <h1 className="text-2xl font-bold text-center mb-4">Edit Your Either/Or Question</h1>
            <h2 className="text-lg text-gray-700 text-center mb-6">Would you rather...</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Edit your option one:</label>
                    <input
                        type="text"
                        value={updateOptionOne}
                        onChange={handleChangeQuestionOne}
                        required
                        className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Edit your option two:</label>
                    <input
                        type="text"
                        value={updateOptionTwo}
                        onChange={handleChangeQuestionTwo}
                        required
                        className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 transition"
                    >
                        {loading ? <Spinner /> : "Edit Question"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                        setUpdateOptionOne(optionOne);
                        setUpdateOptionTwo(optionTwo);
                        }}
                        className="w-full px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                    >
                        Reset
                    </button>
                </div>
                {successMessage && <p className="text-center text-green-600 font-medium mt-2">{successMessage}</p>}
            </form>
        </div>
    )
};

export default EditQuestion;