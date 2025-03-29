import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";


const MainPage = () => {

    const navigate = useNavigate();

        const handleSurpriseMe = async () => {
            try {
                const response = await api.get("/questions/random");
                navigate(`/questions/${response.data._id}`)
            } catch (error) {
                console.error("Error fetching random question", error);  
            }
        };


        const handleSeeAll = async () => {
                navigate("/questions");
        };
    
    return (
        <>
            <h1>Try out our Either Or Page</h1>
            <h2>Have a go and test out your friends. Are they secretely weirdos as you? Find out!</h2>
            <p>If you aren't sure you are "sane", vote and see how many people think as you!</p>
            <p>Have great fun!</p>
            <h2>🎲 Wanna see a random question?</h2>
            <button onClick={handleSurpriseMe}>Surprise Me</button>
            <h2>📋 Or browse them all?</h2>
            <button onClick={handleSeeAll}>See All Questions</button>
        </>
    )
};

export default MainPage;