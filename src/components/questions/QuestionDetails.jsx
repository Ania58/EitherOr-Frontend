import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../api";
import CreateComment from '../comments/CreateComment';
import EditComment from '../comments/EditComment';
import DeleteComment from '../comments/DeleteComment';
import { UserContext } from "../contexts/UserContext";
import GoBackButton from "../buttons/GoBackButton";
import Spinner from '../common/Spinner';


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

    const { user, loading } = useContext(UserContext);
    const currentUserId = !loading && (user?.uid || localStorage.getItem("voterId"));
    const isCreator = !loading && user && question?.creator === user.uid;


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

        const voterId = currentUserId;

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
       
       const voterId = currentUserId;
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

    if (!question) return  <Spinner /> ;

    const totalVotes = question.votesOptionOne.length + question.votesOptionTwo.length;
    const percentOptionOne = ((question.votesOptionOne.length / totalVotes) * 100).toFixed(1);
    const percentOptionTwo = ((question.votesOptionTwo.length / totalVotes) * 100).toFixed(1);

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
             <GoBackButton />
          <h1 className="text-2xl font-bold text-center mb-4">Would you rather...</h1>
          <p className="text-lg text-center text-gray-700 mb-6">{question.optionOne} OR {question.optionTwo}</p>
          {!hasVoted ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                <button
                    onClick={() => setSelectedOption("optionOne")}
                    className={`w-full sm:w-auto px-4 py-2 rounded border transition font-semibold text-center cursor-pointer ${
                        selectedOption === "optionOne"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                    {`🅰️ ${question.optionOne}`}
                </button>
                <button
                    onClick={() => setSelectedOption("optionTwo")}
                    className={`w-full sm:w-auto px-4 py-2 rounded border transition font-semibold text-center cursor-pointer ${
                        selectedOption === "optionTwo"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    >
                    {`🅱️ ${question.optionTwo}`}
                </button>
                <button
                    onClick={handleVote}
                    disabled={!selectedOption}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 transition cursor-pointer"
                >
                    Submit Vote
                </button>
            </div>
            ) : (
                <div className="text-center mb-6">
                    <p className="text-green-600 font-semibold mb-2">✅ You’ve already voted. Thank you!</p>
                    {resultsVisible && (
                        <div className="space-y-2">
                            <p>You chose: <strong>{question[selectedOption]}</strong></p>
                            <p>{question.optionOne}: {percentOptionOne}% ({question.votesOptionOne.length} votes)</p>
                            <p>{question.optionTwo}: {percentOptionTwo}% ({question.votesOptionTwo.length} votes)</p>
                        </div>
            )}
                </div>
          )}
          {isCreator && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <button onClick={handleEdit} className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition cursor-pointer">Edit Question</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer">Delete Question</button>
            </div>
          )}
          {question && (
                <div className="text-center mb-6">
                    <p className="text-purple-600 font-medium">🌀 Weird Votes: {question.weirdVotes}</p>
                    {hasMarkedWeird ? (
                        <p className="text-sm text-gray-600 mt-1">😵‍💫 You’ve already marked this question as weird. Thanks for your honesty!</p>
                    ) : (
                        <button onClick={handleWeirdVote} disabled={hasMarkedWeird} className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 transition cursor-pointer">
                        😵‍💫 This is weird
                        </button>
                    )}
                </div>
          )}
          <div className="comment-section mt-8">
            <CreateComment onCommentAdded={setComments} />
            <h3 className="text-xl font-semibold mt-6 mb-2">💬 Comments</h3>
            {comments.length === 0 ? (
                <p className="text-gray-600">😶 No comments yet. Be the first!</p>
            ) : (
                <>
                    {editMessage && <p className="text-green-600 text-sm">{editMessage}</p>}
                    {deleteMessage && <p className="text-red-600 text-sm">{deleteMessage}</p>}
                    <ul className="space-y-4 mt-4">
                        {comments.map((comment) => {
                            return (
                                <li key={comment._id} className="bg-gray-50 p-3 rounded shadow-sm">
                                    <p className="text-sm"><strong>{comment.name || comment.user}:</strong> {comment.text}</p>
                                    {comment.user === currentUserId && (
                                        <div className="flex gap-2 mt-2">
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
                                        </div>
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