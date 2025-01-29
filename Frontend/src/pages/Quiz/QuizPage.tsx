import { Button, Layout, Input, Rate } from "antd";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader.tsx";
import PageFooter from "../../components/PageFooter.tsx";

const { Content } = Layout;

const QuizPage = () => {
  const [quizData, setQuizData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(1);

  let params = useParams();
  const quizId = params.quizId;

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        let apiUrl = `https://quizzler-backend-1.onrender.com/api/quizzes/${quizId}/details`;
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}` || "",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setQuizData(data);
      } catch (error) {
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
            authorization: `Bearer ${localStorage.getItem("token")}` || "",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

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
            authorization: `Bearer ${localStorage.getItem("token")}` || "",
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
          authorization: `Bearer ${localStorage.getItem("token")}` || "",
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
        [{ ...newReview, User: { email: userEmail } }, ...prevReviews].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
      setNewComment("");
      setRating(1);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <PageHeader />
      <Content style={{ padding: "20px", flex: 1 }}>
        {!quizData ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#888" }}>
            Nie znaleziono quizu.
          </p>
        ) : (
          <div style={{ textAlign: "center" }}>
            <h1>{quizData.name}</h1>
            <img
              src={quizData.img_url || "https://placehold.co/600x400"}
              alt={quizData.name}
              style={{ width: "300px", marginBottom: "20px" }}
            />
            <p>{quizData.description}</p>
            <Button type="primary">
              <Link to={`/quiz/${quizData.quiz_id}/solve`}>Rozwiąż quiz</Link>
            </Button>

            <div
              style={{
                marginTop: "40px",
                textAlign: "left",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <h2>Komentarze</h2>
              <Rate value={rating} onChange={setRating} />
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
                style={{ marginTop: "10px" }}
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
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "10px 0",
                    }}
                  >
                    <p>
                      <strong>{review.User.email}</strong>
                    </p>
                    <Rate
                      disabled
                      value={review.stars}
                      style={{ fontSize: "14px" }}
                    />
                    <p>{review.comment}</p>
                    <p style={{ fontSize: "12px", color: "#888" }}>
                      {new Date(review.createdAt).toLocaleString()}
                    </p>
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
