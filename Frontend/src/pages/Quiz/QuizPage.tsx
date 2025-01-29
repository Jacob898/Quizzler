import { Button, Layout, Input, Rate, Card } from "antd";
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

  //-- fetching current User username
  const [username, setUsername] = useState("");
  const user_id = localStorage.getItem("userID");
  const user_token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://quizzler-backend-1.onrender.com/api/users/profile/${user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${user_token}`
          }
        });
        const data = await response.json();
        setUsername(data.email);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

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

    fetchQuizData();
  }, [quizId]);

  return (
      <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <PageHeader />
        <Content style={{ padding: "20px", flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          {!quizData ? (
              <Card
                  style={{
                    textAlign: "center",
                    padding: "5vh",
                    width: "90vh",
                    backgroundColor: "black",
                  }}
              >
                <h2>Aby kontynuować, zaloguj się lub zarejestruj.</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
                  <Button type="primary">
                    <Link to="/login">Zaloguj się</Link>
                  </Button>
                  <Button>
                    <Link to="/register">Zarejestruj się</Link>
                  </Button>
                </div>
              </Card>
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
              </div>
          )}
        </Content>
        <PageFooter />
      </Layout>
  );
};

export default QuizPage;
