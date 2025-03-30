import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";


const EditComment = ({commentId, onCommentUpdated, initialText, onNotifyEdit}) => {
    const { id } = useParams();
    const [ updateComment, setUpdateComment ] = useState(initialText || "");

    useEffect(() => {
        if (!localStorage.getItem("voterId")) {
            const newId = crypto.randomUUID(); 
            localStorage.setItem("voterId", newId);
        }
    }, []);

    const CommentorId = localStorage.getItem("voterId");

    const handleChange = (e) => {
        setUpdateComment(e.target.value)
    };

    const editComment = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/questions/${id}/comments`, {
                commentId, 
                text: updateComment, 
                user: CommentorId
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
        }
    };

    return (
        <form onSubmit={editComment}>
            <input type="text" value={updateComment} onChange={handleChange} placeholder="Edit your comment" />
            <button type="submit">Edit</button>
        </form>
    );

};

export default EditComment;