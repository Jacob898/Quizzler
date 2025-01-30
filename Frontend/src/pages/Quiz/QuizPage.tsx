import React, { useEffect, useState } from "react";
import { Button, Layout, Input, Rate, Card } from "antd";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader.tsx";
import PageFooter from "../../components/PageFooter.tsx";
import "./QuizPage.css";

const { Content } = Layout;

const QuizPage = () => {
    const [quizData, setQuizData] = useState("loading");
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(1);
    const [adminsId, setAdminsId] = useState([4]);

    let params = useParams();
    const quizId = params.quizId;

    const [username, setUsername] = useState("");
    const user_id = localStorage.getItem("userID");
    const user_token = localStorage.getItem("token");
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(
                    `https://quizzler-backend-1.onrender.com/api/users/profile/${user_id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${user_token}`,
                        },
                    }
                );
                const data = await response.json();
                setUsername(data.email);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUserData();
    }, [user_id, user_token]);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                let apiUrl = `https://quizzler-backend-1.onrender.com/api/quizzes/${quizId}/details`;
                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization:
                            `Bearer ${localStorage.getItem("token")}` || "",
                    },
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setQuizData(data);
            } catch (error) {
                setQuizData(null);
                console.error("Error fetching quiz data:", error);
            }
        };

        const fetchReviews = async () => {
            try {
                let reviewsUrl = `https://quizzler-backend-1.onrender.com/api/reviews/quiz/${quizId}`;
                const response = await fetch(reviewsUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization:
                            `Bearer ${localStorage.getItem("token")}` || "",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch reviews");
                }
                const data = await response.json();
                setReviews(
                    data.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                );
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        const fetchAdminsId = async () => {
            try {
                let adminIdURL = `https://quizzler-backend-1.onrender.com/api/admin/admins`;
                const response = await fetch(adminIdURL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization:
                            `Bearer ${localStorage.getItem("token")}` || "",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch reviews");
                }
                const data = await response.json();
                setAdminsId(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchAdminsId();
        fetchQuizData();
        fetchReviews();
    }, [quizId]);

    const fetchUserEmail = async (userId) => {
        try {
            const response = await fetch(
                `https://quizzler-backend-1.onrender.com/api/users/profile/${userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization:
                            `Bearer ${localStorage.getItem("token")}` || "",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch user profile");
            }
            const userData = await response.json();
            return userData.email;
        } catch (error) {
            console.error("Error fetching user email:", error);
            return "Nieznany użytkownik";
        }
    };

    const handleAddReview = async () => {
        try {
            let addReviewUrl = `https://quizzler-backend-1.onrender.com/api/reviews`;
            const response = await fetch(addReviewUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization:
                        `Bearer ${localStorage.getItem("token")}` || "",
                },
                body: JSON.stringify({
                    quiz_id: quizId,
                    stars: rating,
                    comment: newComment,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to add review");
            }
            const newReview = await response.json();
            const userEmail = await fetchUserEmail(newReview.user_id);
            setReviews((prevReviews) =>
                [
                    { ...newReview, User: { email: userEmail } },
                    ...prevReviews,
                ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            );
            setNewComment("");
            setRating(1);
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };

    const handleDeleteReview = async (review_ID) => {
        try {
            const response = await fetch(
                `https://quizzler-backend-1.onrender.com/api/reviews/${review_ID}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        authorization:
                            `Bearer ${localStorage.getItem("token")}` || "",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to delete review");
            }
            setReviews((prevReviews) =>
                prevReviews.filter(
                    (review) => review.quiz_review_id !== review_ID
                )
            );
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const getRatingClass = (value) => {
        if (value >= 4) return "high-rating";
        if (value >= 2) return "medium-rating";
        return "low-rating";
    };

    console.log("XDDD");
    console.log(quizData);

    return (
        <Layout
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <PageHeader />
            <Content
                style={{
                    padding: "20px",
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {quizData === "loading" ? (
                    <></>
                ) : !quizData ? (
                    <Card
                        style={{
                            textAlign: "center",
                            padding: "10vh",
                            width: "90vh",
                        }}
                    >
                        <h2>Aby kontynuować, zaloguj się lub zarejestruj.</h2>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                marginTop: "20px",
                            }}
                        >
                            <Button type="primary">
                                <Link to="/login">Zaloguj się</Link>
                            </Button>
                            <Button>
                                <Link to="/register">Zarejestruj się</Link>
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div style={{ textAlign: "center", width: "100%" }}>
                        <h1>{quizData.name}</h1>
                        <img
                            src={
                                quizData.img_url ||
                                "https://placehold.co/600x400"
                            }
                            alt={quizData.name}
                            style={{
                                width: "300px",
                                marginBottom: "20px",
                                marginTop: "20px",
                            }}
                        />

                        <div className="quiz-description">
                            <p>{quizData.description}</p>
                            <Button
                                type="primary"
                                className="solve-quiz-button"
                            >
                                <Link to={`/quiz/${quizData.quiz_id}/solve`}>
                                    Rozwiąż quiz
                                </Link>
                            </Button>
                        </div>
                        <div
                            style={{
                                marginTop: "40px",
                                textAlign: "left",
                                maxWidth: "600px",
                                margin: "0 auto",
                            }}
                        >
                            <h2>Komentarze</h2>
                            <Rate
                                className={`custom-rate ${getRatingClass(
                                    rating
                                )}`}
                                value={rating}
                                onChange={setRating}
                            />
                            <Input.TextArea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={3}
                                placeholder="Dodaj komentarz..."
                                style={{ marginTop: "10px" }}
                            />
                            <Button
                                type="primary"
                                onClick={handleAddReview}
                                style={{
                                    marginTop: "10px",
                                    marginBottom: "20px",
                                }}
                            >
                                Dodaj komentarz
                            </Button>
                        </div>
                        <div
                            style={{
                                marginTop: "20px",
                                textAlign: "left",
                                maxWidth: "600px",
                                margin: "0 auto",
                            }}
                        >
                            <h2>Opinie Quizzlerowiczów:</h2>
                            {reviews.length === 0 ? (
                                <p>Brak recenzji.</p>
                            ) : (
                                reviews.map((review) => (
                                    <div
                                        key={review.quiz_review_id}
                                        className="comment-container"
                                    >
                                        <p>
                                            <strong>{review.User.email}</strong>
                                        </p>
                                        <Rate
                                            className={`custom-rate ${getRatingClass(
                                                review.stars
                                            )}`}
                                            value={review.stars}
                                            disabled
                                            style={{ fontSize: "14px" }}
                                        />
                                        <p>{review.comment}</p>
                                        <p
                                            style={{
                                                fontSize: "12px",
                                                color: "#888",
                                            }}
                                        >
                                            {new Date(
                                                review.createdAt
                                            ).toLocaleString()}
                                        </p>
                                        {(review.User.email === username ||
                                            adminsId.includes(
                                                Number(user_id)
                                            )) && (
                                            <Button
                                                onClick={() =>
                                                    handleDeleteReview(
                                                        review.quiz_review_id
                                                    )
                                                }
                                                danger
                                            >
                                                Usuń opinię
                                            </Button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </Content>
            <PageFooter />
        </Layout>
    );
};

export default QuizPage;
