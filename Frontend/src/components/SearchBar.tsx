import React, { useState, useEffect } from "react";
import { Input, Card, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() && viewportWidth >= 768) {
      fetchQuizzesByNameOrId(searchQuery);
    } else {
      setFilteredQuizzes([]);
    }
  }, [searchQuery, viewportWidth]);

  const fetchQuizzesByNameOrId = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://quizzler-backend-1.onrender.com/api/quizzes`
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const quizzes = Array.isArray(data) ? data : data.quizzes || [];

      const filteredData = quizzes.filter(
        (quiz) =>
          quiz.name?.toLowerCase().includes(query) ||
          quiz.quiz_id?.toString().includes(query)
      );

      setFilteredQuizzes(filteredData);
    } catch (error) {
      console.error("Error przy pobieraniu quizów:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setFilteredQuizzes([]);
      if (onEnter) onEnter();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: isMobile ? "100%" : "300px",
        position: "relative",
      }}
    >
      <Input
        placeholder="Szukaj quizu"
        prefix={<SearchOutlined />}
        value={searchQuery}
        onChange={handleSearchChange}
        onPressEnter={handleSearch}
        loading={loading}
        style={{ width: "100%" }}
      />

      {/* NIE POKAZUJEMY PROPOZYCJI NA MAŁYCH EKRANACH */}
      {filteredQuizzes.length > 0 && viewportWidth >= 768 && (
        <div
          style={{
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
          }}
        >
          <List
            itemLayout="vertical"
            dataSource={filteredQuizzes}
            renderItem={(quiz) => (
              <List.Item key={quiz.quiz_id} style={{ padding: "8px 16px" }}>
                <Link to={`/quiz/${quiz.quiz_id}`} onClick={onItemSelect}>
                  <Card hoverable style={{ width: "100%", margin: 0 }}>
                    <Card.Meta
                      title={quiz.name}
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
