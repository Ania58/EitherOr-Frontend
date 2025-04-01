import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api";


const CreateQuestion = () => {

    const [optionOne, setOptionOne] = useState("");
    const [optionTwo, setOptionTwo] = useState("");
    const [message, setMessage] = useState("");

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
        };
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create your Either/Or Question</h1>
            <h2>Would you rather:</h2>
            <label>Write your option one:</label>
            <input type="text" value={optionOne} onChange={handleChangeOne} />
            <label>Write your option two:</label>
            <input type="text" value={optionTwo} onChange={handleChangeTwo} />
            <button type="submit">Create Question</button>
            {message && <p>{message}</p>}
        </form>
    )
};

export default CreateQuestion;