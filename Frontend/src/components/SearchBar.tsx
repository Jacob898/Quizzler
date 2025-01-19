import React, { useState } from "react";
import { Input, Card, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { categories } from "../data/categories";
import { Quiz } from "../types/types";

interface SearchBarProps {
  isMobile?: boolean;
  onItemSelect?: () => void;
  onEnter?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  isMobile,
  onItemSelect,
  onEnter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const lowerCaseQuery = query.toLowerCase(); // Filtrowanie bez uwzględniania wielkości liter
      const results = categories
        .flatMap((category) =>
          category.quizzes.map((quiz) => ({
            ...quiz,
            categoryId: category.id,
          }))
        )
        .filter((quiz) => quiz.title.toLowerCase().includes(lowerCaseQuery));
      setFilteredQuizzes(results);
    } else {
      setFilteredQuizzes([]);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setFilteredQuizzes([]);
      if (onEnter) {
        onEnter();
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: isMobile ? "100%" : "300px",
  };

  return (
    <div style={containerStyle}>
      <Input
        placeholder="Szukaj quizu"
        prefix={<SearchOutlined />}
        value={searchQuery}
        onChange={handleSearchChange}
        onPressEnter={handleSearch}
        style={{
          marginBottom: "10px",
          width: "100%",
        }}
      />
      {filteredQuizzes.length > 0 && (
        <div
          style={{
            marginTop: "10px",
            backgroundColor: "white",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Row gutter={[16, 16]}>
            {filteredQuizzes.map((quiz) => (
              <Col key={quiz.id} span={24}>
                <Link
                  to={`/categories/${quiz.categoryId}/quiz/${quiz.id}`}
                  onClick={onItemSelect}
                >
                  <Card
                    hoverable
                    style={{ marginBottom: "10px", width: "100%" }}
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
        </div>
      )}
    </div>
  );
};

export default SearchBar;
