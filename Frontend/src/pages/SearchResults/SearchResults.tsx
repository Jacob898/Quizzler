import { useLocation, Link } from "react-router-dom";
import { Layout, Card, Row, Col } from "antd";
import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import CustomCard from "../../components/CustomCard";

const { Content } = Layout;

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const originalQuery = params.get("query") || "";
  const query = originalQuery.toLowerCase().trim();
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://quizzler-backend-1.onrender.com/api/quizzes`
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Fetched quizzes:", data);
        const quizzes = Array.isArray(data) ? data : data.quizzes || [];
        console.log("Processed quizzes:", quizzes);

        const filteredData = quizzes.filter(
          (quiz) =>
            quiz.name?.toLowerCase().includes(query) ||
            quiz.quiz_id?.toString().includes(query)
        );
        console.log("Filtered quizzes:", filteredData);
        setFilteredQuizzes(filteredData);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchQuizzes();
    }
  }, [query]);

  return (
    <Layout
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <PageHeader />
      <Content style={{ padding: "20px", flex: 1 }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
          Wyniki wyszukiwania dla: "{originalQuery}"
        </h2>
        {loading ? (
          <p style={{ textAlign: "center" }}>Ładowanie wyników...</p>
        ) : filteredQuizzes.length > 0 ? (
          <Row gutter={[16, 16]} justify="center">
            {filteredQuizzes.map((quiz) => (
              <Col key={quiz.quiz_id} xs={24} sm={12} md={8}>
                <Link to={`/quiz/${quiz.quiz_id}`}>
                  <CustomCard
                    title={quiz.name}
                    description={quiz.description}
                    image={quiz.img_url || "https://placehold.co/200x150"}
                  />
                </Link>
              </Col>
            ))}
          </Row>
        ) : (
          <p style={{ textAlign: "center" }}>Brak wyników wyszukiwania.</p>
        )}
      </Content>
      <PageFooter />
    </Layout>
  );
};

export default SearchResults;
