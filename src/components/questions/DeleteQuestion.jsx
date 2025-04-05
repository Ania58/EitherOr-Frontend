import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import Spinner from "../common/Spinner";

const DeleteQuestion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const confirmDeletion = async () => {
            const confirm = window.confirm("Are you sure you want to delete this question? This action is irreversible");

            if (!confirm) {
                navigate(-1);
                return;
            };

            try {
                await api.delete(`/questions/${id}/delete`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                  });
                setSuccess(true);
                setTimeout(() => navigate("/questions"), 1500);
            } catch (error) {
                console.error("Error deleting question", error);
            } finally {
                setLoading(false);
            };
        };
        confirmDeletion();
    }, [id, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="text-center">
                {loading ? (
                <Spinner />
                ) : success ? (
                <p className="text-green-600 text-xl font-semibold">✅ Question successfully deleted!</p>
                ) : (
                <p className="text-red-500">❌ Something went wrong during deletion.</p>
                )}
            </div>
        </div>
    )
};

export default DeleteQuestion;