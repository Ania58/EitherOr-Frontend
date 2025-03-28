import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

const DeleteQuestion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const confirmDeletion = async () => {
            const confirm = window.confirm("Are you sure you want to delete this question? This action is irreversible");

            if (!confirm) {
                navigate(-1);
                return;
            };

            try {
                await api.delete(`/questions/${id}`);
                setSuccess(true);
                setTimeout(() => navigate("/questions"), 1500);
            } catch (error) {
                console.error("Error deleting question", error);
            };
        };
        confirmDeletion();
    }, [id, navigate]);

    return success ? <p>✅ Question successfully deleted!</p> : null;
};

export default DeleteQuestion;