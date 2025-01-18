import { useLocation, Link } from "react-router-dom";
import { Layout, Card, Row, Col } from "antd";
import { categories } from "../../data/categories";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";

const { Content } = Layout;

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query")?.toLowerCase() || "";

  const filteredQuizzes = categories
    .flatMap((category) =>
      category.quizzes.map((quiz) => ({
        ...quiz,
        categoryId: category.id,
      }))
    )
    .filter((quiz) => quiz.title.toLowerCase().includes(query));

  return (
    <Layout>
      <PageHeader />
      <Content style={{ padding: "20px", flex: 1, backgroundColor: "#f5f5f5" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
          Wyniki wyszukiwania dla: "{query}"
        </h2>
        {filteredQuizzes.length > 0 ? (
          <Row gutter={[16, 16]} justify="center">
            {filteredQuizzes.map((quiz) => (
              <Col key={quiz.id} xs={24} sm={12} md={8}>
                <Link to={`/categories/${quiz.categoryId}/quiz/${quiz.id}`}>
                  <Card
                    hoverable
                    cover={
                      <img
                        src={quiz.img}
                        alt={quiz.title}
                        style={{ maxHeight: "150px", objectFit: "cover" }}
                      />
                    }
                  >
                    <Card.Meta
                      title={quiz.title}
                      description={quiz.description}
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        ) : (
          <p style={{ textAlign: "center" }}>Zostałeś sQuizzlerowany </p>
        )}
      </Content>
      <PageFooter />
    </Layout>
  );
};

export default SearchResults;
