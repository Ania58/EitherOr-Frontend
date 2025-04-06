import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import QuestionCard from "./QuestionCard";
import Spinner from "../common/Spinner";

const sortLabels = {
    all: "📋 All Questions",
    newest: "🆕 Newest",
    popular: "🔥 Most Popular",
    weird: "😵‍💫 Weirdest",
  };

const QuestionList = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

        const params = new URLSearchParams(location.search);
        const sortBy = params.get("sortBy");
        const page = parseInt(params.get("page")) || 1;
        const limit = 5;

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
               setLoading(true);
               const response = await api.get(`/questions?page=${page}&limit=${limit}${sortBy ? `&sortBy=${sortBy}` : ""}`);
               setQuestions(response.data); 
               const countRes = await api.get(`/questions?${sortBy ? `sortBy=${sortBy}&` : ""}noPagination=true`);
               const total = countRes.data.length;
               setTotalPages(Math.ceil(total / limit));
            } catch (error) {
                console.error("Error fetching questions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    },[location.search]);

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(location.search);
        params.set("page", newPage);
        navigate(`/questions?${params.toString()}`);
      };

    const displaySort = sortBy || "all";

    return (
        <div>
            <h2>All Questions</h2>
            <p>
                🧭 Currently sorted by: <strong>{sortLabels[displaySort]}</strong>
            </p>

            {loading ? (
                  <Spinner />
            ) : questions.length === 0 ? (
                <p>😢 No questions found. Be the first to create one!</p>
            ) : (
                <>
                    {questions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                    ))}
                 <div className="flex justify-center items-center mt-6 flex-wrap gap-2">
                    {page > 1 && (
                    <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        ◀ Previous
                    </button>
                    )}
                    {totalPages &&
                        Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                            <button
                            key={pg}
                            onClick={() => handlePageChange(pg)}
                            className={`px-3 py-2 rounded ${
                                pg === page
                                  ? "bg-orange-400 text-white font-bold cursor-pointer"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                              }`}
                            >
                            {pg}
                            </button>
                    ))}
                    {questions.length === limit && (
                    <button onClick={() => handlePageChange(page + 1)} disabled={totalPages && page >= totalPages} className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Next ▶
                    </button>
                    )}
                 </div>
                </>
            )}
        </div>
    );
};

export default QuestionList;
