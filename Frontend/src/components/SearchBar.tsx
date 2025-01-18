import React, { useState } from "react";
import { Input, Card, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { categories } from "../data/categories";
import { Quiz } from "../types/types";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const results = categories
        .flatMap((category) =>
          category.quizzes.map((quiz) => ({
            ...quiz,
            categoryId: category.id,
          }))
        )
        .filter((quiz) => quiz.title.toLowerCase().includes(query));
      setFilteredQuizzes(results);
    } else {
      setFilteredQuizzes([]);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setFilteredQuizzes([]);
    }
  };

  return (
    <div style={{ position: "relative", width: "300px" }}>
      <Input
        placeholder="Szukaj quizu"
        prefix={<SearchOutlined />}
        value={searchQuery}
        onChange={handleSearchChange}
        onPressEnter={handleSearch}
        style={{ marginBottom: "10px" }}
      />
      {filteredQuizzes.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            backgroundColor: "white",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            width: "100%",
            maxHeight: "300px",
            overflowY: "auto",
            overflowX: "hidden",
            padding: "10px",
          }}
        >
          <Row gutter={[16, 16]}>
            {filteredQuizzes.map((quiz) => (
              <Col key={quiz.id} span={24}>
                <Link to={`/categories/${quiz.categoryId}/quiz/${quiz.id}`}>
                  <Card hoverable>
                    <Card.Meta
                      title={quiz.title}
                      description={quiz.description}
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
