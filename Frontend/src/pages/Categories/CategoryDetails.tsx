import React from "react";
import { Layout, Card, Row, Col } from "antd";
import { useParams, Link } from "react-router-dom";
import { categories } from "../../data/categories";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";

const { Content } = Layout;

const CategoryDetails: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const category = categories.find(
    (cat) => cat.id === parseInt(categoryId || "")
  );

  if (!category) {
    return (
      <Layout>
        <PageHeader />
        <Content
          style={{ padding: "20px", flex: 1, backgroundColor: "#f5f5f5" }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
            Nie znaleziono kategorii.
          </h2>
        </Content>
        <PageFooter />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader />
      <Content style={{ padding: "20px", flex: 1, backgroundColor: "#f5f5f5" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
          Quizy w kategorii {category.name.toUpperCase()}
        </h2>
        <Row gutter={[16, 16]} justify="center">
          {category.quizzes.map((quiz) => (
            <Col key={quiz.id} xs={24} sm={12} md={8}>
              <Link to={`/categories/${category.id}/quiz/${quiz.id}`}>
                <Card
                  hoverable
                  cover={<img alt={quiz.title} src={quiz.img} />}
                  title={quiz.title}
                  bordered={false}
                >
                  <p>{quiz.description}</p>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Content>
      <PageFooter />
    </Layout>
  );
};

export default CategoryDetails;
