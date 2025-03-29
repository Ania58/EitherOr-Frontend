import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import QuestionCard from "./QuestionCard";

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
                <p>⏳ Loading questions...</p>
            ) : questions.length === 0 ? (
                <p>😢 No questions found. Be the first to create one!</p>
            ) : (
                <>
                    {questions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                    ))}
                 <div className="pagination">
                    {page > 1 && (
                    <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>◀ Previous</button>
                    )}
                    {totalPages &&
                        Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                            <button
                            key={pg}
                            onClick={() => handlePageChange(pg)}
                            style={{
                                fontWeight: pg === page ? "bold" : "normal",
                                margin: "0 5px",
                            }}
                            >
                            {pg}
                            </button>
                    ))}
                    {questions.length === limit && (
                    <button onClick={() => handlePageChange(page + 1)} disabled={totalPages && page >= totalPages}>Next ▶</button>
                    )}
                 </div>
                </>
            )}
        </div>
    );
};

export default QuestionList;
