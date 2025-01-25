import React, { useState } from "react";
import { Input, Card, List } from "antd";
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
      const lowerCaseQuery = query.toLowerCase();
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
    position: "relative",
  };

  const resultsStyle: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    backgroundColor: "white",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    maxHeight: "400px",
    overflowY: "auto",
    borderRadius: "4px",
    marginTop: "8px",
  };

  const listItemStyle: React.CSSProperties = {
    padding: "8px 16px",
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
          width: "100%",
        }}
      />
      {filteredQuizzes.length > 0 && (
        <div style={resultsStyle}>
          <List
            itemLayout="vertical"
            dataSource={filteredQuizzes}
            renderItem={(quiz) => (
              <List.Item key={quiz.id} style={listItemStyle}>
                <Link
                  to={`/categories/${quiz.categoryId}/quiz/${quiz.id}`}
                  onClick={onItemSelect}
                >
                  <Card hoverable style={{ width: "100%", margin: 0 }}>
                    <Card.Meta
                      title={quiz.title}
                      description={quiz.description}
                    />
                  </Card>
                </Link>
              </List.Item>
            )}
            style={{ padding: "0 16px" }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
