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
        <form onSubmit={editComment}>
            <input type="text" value={updateComment} onChange={handleChange} placeholder="Edit your comment" />
            <button type="submit" disabled={loading}> {loading ? <Spinner /> : "Edit"}</button>
        </form>
    );

};

export default EditComment;