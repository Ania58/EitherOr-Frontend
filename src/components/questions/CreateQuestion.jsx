import React, { useState } from 'react';
import api from "../../api";


const CreateQuestion = () => {

    const [optionOne, setOptionOne] = useState("");
    const [optionTwo, setOptionTwo] = useState("");

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
            const response = await api.post('/questions/create', questionData);
            console.log('Question created:', response.data);
            setOptionOne('');
            setOptionTwo('');
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
        </form>
    )
};

export default CreateQuestion;