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
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow flex flex-col items-center justify-center px-4 text-center space-y-6 bg-gradient-to-br from-green-100 to-blue-100">
                <h1 className="text-4xl font-bold text-green-800">Welcome to Either Or</h1>
                <h2 className="text-2xl text-gray-700 max-w-xl">
                  Have a go and test out your friends. Are they secretely weirdos as you? 🤔
                </h2>
                <p className="text-lg text-gray-600 max-w-md">
                  Not sure you're “sane”? Vote and find out how many people think like you!
                </p>
                <p className="text-lg text-gray-600">Ready to play? 🎉</p>
                <div className="space-y-4 mt-6">
                  <h2 className="text-xl font-semibold">🎲 Wanna see a random question?</h2>
                  <button
                    onClick={handleSurpriseMe}
                    className="px-6 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
                  >
                    Surprise Me
                  </button>
                  <h2 className="text-xl font-semibold mt-6">📋 Or browse them all?</h2>
                  <button
                    onClick={handleSeeAll}
                    className="px-6 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
                  >
                    See All Questions
                  </button>
                </div>
              </main>
            </div>
        );          
};

export default MainPage;