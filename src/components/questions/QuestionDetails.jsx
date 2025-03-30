import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../api";
import { auth } from "../../config/firebase";
import CreateComment from '../comments/CreateComment';
import EditComment from '../comments/EditComment';
import DeleteComment from '../comments/DeleteComment';


const QuestionDetails = () => {
    const [question, setQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [hasVoted, setHasVoted] = useState(false);
    const [resultsVisible, setResultsVisible] = useState(false);
    const [hasMarkedWeird, setHasMarkedWeird] = useState(false);
    const [comments, setComments] = useState([]);
    const [editMessage, setEditMessage] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");


    const { id } = useParams();

    useEffect(() => {
        if (!localStorage.getItem("voterId")) {
          const newId = crypto.randomUUID(); 
          localStorage.setItem("voterId", newId);
        }
      }, []);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await api.get(`/questions/${id}`);
                setQuestion(response.data);  
                setComments(response.data.comments || []);
            } catch (error) {
                console.error("Failed to fetch question", error);
            };
        };

        fetchQuestion();
    },[id]);

    const navigate = useNavigate();

    const handleEdit = () => {
    navigate(`/questions/${id}/edit`);
    };

    const handleDelete = () => {
        navigate(`/questions/${id}/delete`)
    };

    const handleVote = async () => {

        if (!selectedOption) return;

        const firebaseUser = auth.currentUser;
        const voterId = firebaseUser?.uid || localStorage.getItem("voterId");

        try {
            await api.post(`/questions/${id}/vote`, {
                option: selectedOption,
                voterId, 
              });
            setHasVoted(true);
            setResultsVisible(true);

            const updated = await api.get(`/questions/${id}`);
            setQuestion(updated.data);

        } catch (error) {
            if (error.response && error.response.status === 403) {
                alert("You've already voted on this question!");
                setHasVoted(true);
                setResultsVisible(true); 
            } else {
                console.error("Failed to cast a vote", error);
            }
        }
    };

    const handleWeirdVote = async () => {
        const firebaseUser = auth.currentUser;
        const voterId = firebaseUser?.uid || localStorage.getItem("voterId");
        try {
            await api.post(`/questions/${id}/weird`, { voterId });
            const updated = await api.get(`/questions/${id}`);
            setQuestion(updated.data)
            setHasMarkedWeird(true)
        } catch (error) {
            if (error.response && error.response.status === 403) {
                alert("You’ve already marked this question as weird.");
                setHasMarkedWeird(true);
              } else {
                console.error("Failed to mark as weird", error);
              }
        }
    };

    if (!question) return <p>Loading...</p>;

    const totalVotes = question.votesOptionOne.length + question.votesOptionTwo.length;
    const percentOptionOne = ((question.votesOptionOne.length / totalVotes) * 100).toFixed(1);
    const percentOptionTwo = ((question.votesOptionTwo.length / totalVotes) * 100).toFixed(1);

    return (
        <div>
          <h1>Would you rather...</h1>
          <p>{question.optionOne} OR {question.optionTwo}</p>
          {!hasVoted ? (
            <>
            <button onClick={() => setSelectedOption("optionOne")} className={selectedOption === "optionOne" ? "selected" : ""}>{question.optionOne}</button>
            <button onClick={() => setSelectedOption("optionTwo")} className={selectedOption === "optionTwo" ? "selected" : ""}>{question.optionTwo}</button>
            <button onClick={handleVote} disabled={!selectedOption}>Submit Vote</button>
            </>
            ) : (
                <>
                    <p>✅ You’ve already voted. Thank you!</p>
                    {resultsVisible && (
                        <div>
                            <p>You chose: <strong>{question[selectedOption]}</strong></p>
                            <p>{question.optionOne}: {percentOptionOne}% ({question.votesOptionOne.length} votes)</p>
                            <p>{question.optionTwo}: {percentOptionTwo}% ({question.votesOptionTwo.length} votes)</p>
                        </div>
            )}
                </>
          )}
          <button onClick={handleEdit}>Edit Question</button>
          <button onClick={handleDelete}>Delete Question</button>
          {question && (
                <>
                    <p>🌀 Weird Votes: {question.weirdVotes}</p>
                    {hasMarkedWeird ? (
                        <p>😵‍💫 You’ve already marked this question as weird. Thanks for your honesty!</p>
                    ) : (
                        <button onClick={handleWeirdVote} disabled={hasMarkedWeird}>
                        😵‍💫 This is weird
                        </button>
                    )}
                </>
          )}
          <div className="comment-section">
            <CreateComment onCommentAdded={setComments} />
            <h3>💬 Comments</h3>
            {comments.length === 0 ? (
                <p>😶 No comments yet. Be the first!</p>
            ) : (
                <>
                    {editMessage && <p style={{ color: "green" }}>{editMessage}</p>}
                    {deleteMessage && <p style={{ color: "red" }}>{deleteMessage}</p>}
                    <ul>
                        {comments.map((comment) => {
                            const firebaseUser = auth.currentUser;
                            const currentUserId = firebaseUser?.uid || localStorage.getItem("voterId");
                            return (
                                <li key={comment._id}>
                                    <strong>{comment.name || comment.user}:</strong> {comment.text}
                                    {comment.user === currentUserId && (
                                        <>
                                        <EditComment
                                            commentId={comment._id}
                                            initialText={comment.text}
                                            onCommentUpdated={setComments}
                                            onNotifyEdit={() => {
                                            setEditMessage("✏️ Your comment was updated.");
                                            setTimeout(() => setEditMessage(""), 3000);
                                            }}
                                        />
                                        <DeleteComment
                                            commentId={comment._id}
                                            onCommentDeleted={setComments}
                                            onNotifyDelete={() => {
                                            setDeleteMessage("🗑️ Your comment was deleted.");
                                            setTimeout(() => setDeleteMessage(""), 3000);
                                            }}
                                        />
                                        </>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
          </div>
        </div>
    );
};

export default QuestionDetails;