import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { UserContext } from "../contexts/UserContext"; 
import Spinner from "../common/Spinner";


const EditComment = ({commentId, onCommentUpdated, initialText, onNotifyEdit}) => {
    const { id } = useParams();
    const [ updateComment, setUpdateComment ] = useState(initialText || "");
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!localStorage.getItem("voterId")) {
            const newId = crypto.randomUUID(); 
            localStorage.setItem("voterId", newId);
        }
    }, []);

    const commentorId = user?.uid || localStorage.getItem("voterId");

    const handleChange = (e) => {
        setUpdateComment(e.target.value)
    };

    const editComment = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await api.put(`/questions/${id}/comments`, {
                commentId, 
                text: updateComment, 
                user: commentorId
            });
            setUpdateComment("");
            if (onCommentUpdated) {
                onCommentUpdated(response.data.comments); 
              };
            if (onNotifyEdit) {
                onNotifyEdit(); 
            };
        } catch (error) {
            console.error("Error updating comment", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={editComment} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input 
                type="text" 
                value={updateComment} 
                onChange={handleChange} 
                placeholder="Edit your comment" 
                className="w-full sm:w-auto px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"/>
            <button type="submit" disabled={loading || updateComment.trim() === ""} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 transition">
                 {loading ? <Spinner /> : "Edit"}
            </button>
        </form>
    );

};

export default EditComment;