import { Layout, Card, Row, Col, Carousel } from "antd";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import { categories } from "../../data/categories";
import styles from "./Home.module.css";

const { Content } = Layout;

const Home = () => {
  const featuredQuizzes = categories
    .flatMap((category) =>
      category.quizzes.map((quiz) => ({
        ...quiz,
        categoryName: category.name,
        categoryId: category.id,
      }))
    )
    .slice(0, 5);

  return (
    <Layout>
      <PageHeader />
      <Content style={{ padding: "20px", flex: 1, backgroundColor: "#f5f5f5" }}>
        <h2 style={{ textAlign: "center" }}>Featured</h2>
        <div className={styles["desktop-featured"]}>
          <Row gutter={[16, 16]} justify="center">
            {featuredQuizzes.map((quiz) => (
              <Col key={quiz.id} xs={24} sm={12} md={8}>
                <Link to={`/categories/${quiz.categoryId}/quiz/${quiz.id}`}>
                  <Card
                    hoverable
                    cover={<img alt={quiz.title} src={quiz.img} />}
                    title={quiz.title}
                    bordered={false}
                  >
                    <p>
                      {quiz.description} (Kategoria: {quiz.categoryName})
                    </p>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
        <div className={styles["mobile-featured"]}>
          <Carousel>
            {featuredQuizzes.map((quiz) => (
              <div key={quiz.id}>
                <Link to={`/categories/${quiz.categoryId}/quiz/${quiz.id}`}>
                  <Card
                    hoverable
                    cover={<img alt={quiz.title} src={quiz.img} />}
                    title={quiz.title}
                    bordered={false}
                  >
                    <p>
                      {quiz.description} (Kategoria: {quiz.categoryName})
                    </p>
                  </Card>
                </Link>
              </div>
            ))}
          </Carousel>
        </div>
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>Kategorie</h2>
        <Row gutter={[16, 16]} justify="center">
          {categories.map((category) => (
            <Col key={category.id} xs={24} sm={12} md={8}>
              <Link to={`/categories/${category.id}`}>
                <Card
                  hoverable
                  cover={<img alt={category.name} src={category.img} />}
                  title={category.name}
                  bordered={false}
                >
                  <p>{category.quizzes.length} quizów</p>
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

export default Home;
