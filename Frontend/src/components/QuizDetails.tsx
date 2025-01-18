import { Layout } from "antd";
import { useParams } from "react-router-dom";
import { categories } from "../data/categories";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";

const { Content } = Layout;

const QuizDetails = () => {
  const { categoryId, quizId } = useParams<{
    categoryId: string;
    quizId: string;
  }>();

  const category = categories.find(
    (cat) => cat.id === parseInt(categoryId || "")
  );
  const quiz = category?.quizzes.find((q) => q.id === parseInt(quizId || ""));

  return (
    <Layout>
      <PageHeader />
      <Content style={{ padding: "20px", flex: 1, backgroundColor: "#f5f5f5" }}>
        {!quiz ? (
          <p style={{ textAlign: "center" }}>Nie znaleziono quizu.</p>
        ) : (
          <div style={{ textAlign: "center" }}>
            <h2>{quiz.title}</h2>
            <img
              src={quiz.img}
              alt={quiz.title}
              style={{ width: "300px", marginBottom: "20px" }}
            />
            <p>{quiz.description}</p>
          </div>
        )}
      </Content>
      <PageFooter />
    </Layout>
  );
};

export default QuizDetails;
