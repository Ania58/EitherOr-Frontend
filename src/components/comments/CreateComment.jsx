import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

const CreateComment = () => {
    const { id } = useParams();
    const [ commentText, setCommentText ] = useState("");

     useEffect(() => {
            if (!localStorage.getItem("voterId")) {
              const newId = crypto.randomUUID(); 
              localStorage.setItem("voterId", newId);
            }
          }, []);

    const handleChange = (e) => {
        setCommentText(e.target.value);
    };

    const addComment = async (e) => {
        e.preventDefault();
        const CommentorId = localStorage.getItem("voterId");
       
        try {
            const response = await api.post(`/questions/${id}/comments`,{
                user: CommentorId, 
                text: commentText
            });
            setCommentText("");
        } catch (error) {
            console.error("Error adding comment", error);
        }
    };

    return (
        <form onSubmit={addComment}>
            <h3>Write Your Comment</h3>
            <input type="text" value={commentText} onChange={handleChange}/>
            <button type="submit">Post Your Comment</button>
        </form>
    );
};

export default CreateComment;