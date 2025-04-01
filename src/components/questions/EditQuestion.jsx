import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../api";
import GoBackButton from '../buttons/GoBackButton';

const EditQuestion = () => {
    const [ optionOne, setOptionOne ] = useState("");
    const [ optionTwo, setOptionTwo ] = useState("");
    const [ updateOptionOne, setUpdateOptionOne ] = useState("");
    const [ updateOptionTwo, setUpdateOptionTwo ] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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
        };
    };

    return (
        <form onSubmit={handleSubmit}>
             <GoBackButton />
            <h1>Edit your Either/Or Question</h1>
            <h2>Would you rather:</h2>
            <label>Edit your option one:</label>
            <input type="text" value={updateOptionOne} onChange={handleChangeQuestionOne} />
            <label>Edit your option two:</label>
            <input type="text" value={updateOptionTwo} onChange={handleChangeQuestionTwo} />
            <button type="submit">Edit Question</button>
            <button type="button" 
                onClick={() => {
                    setUpdateOptionOne(optionOne);
                    setUpdateOptionTwo(optionTwo);
                }}>
                Reset
            </button>
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </form>
    )
};

export default EditQuestion;