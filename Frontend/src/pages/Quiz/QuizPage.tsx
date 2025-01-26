import { Button, Layout } from "antd";
import {Link, useParams} from "react-router-dom";
import { categories } from "../../data/categories.ts";
import { Category, Quiz } from "../../types/types.ts";
import PageHeader from "../../components/PageHeader.tsx";
import PageFooter from "../../components/PageFooter.tsx";

const { Content } = Layout;

const QuizPage = () => {
  const { categoryId, quizId } = useParams<{
    categoryId: string;
    quizId: string;
  }>();

  const category: Category | undefined = categories.find(
    (cat) => cat.id === parseInt(categoryId || "")
  );
  const quiz: Quiz | undefined = category?.quizzes.find(
    (q) => q.id === parseInt(quizId || "")
  );

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <PageHeader />
      <Content style={{ padding: "20px", flex: 1, backgroundColor: "#f5f5f5" }}>
        {!quiz ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#888" }}>
            Nie znaleziono quizu.
          </p>
        ) : (
          <div style={{ textAlign: "center" }}>
            <h1>{quiz.title}</h1>
            <img
              src={quiz.img}
              alt={quiz.title}
              style={{ width: "300px", marginBottom: "20px" }}
            />
            <p>{quiz.description}</p>

            <Button type="primary">
              <Link to={`/categories/${categoryId}/quiz/${quiz.id}/solve`}>
                Rozwiąż quiz
              </Link>
            </Button>
          </div>
        )}
      </Content>
      <PageFooter />
    </Layout>
  );
};

export default QuizPage;
