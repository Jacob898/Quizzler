import React, { useState, useEffect } from "react";
import { Layout, Menu, Drawer, Button, Avatar, Input } from "antd";
import { MenuOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const { Header } = Layout;

const PageHeader = () => {
  const [isNavigationVisible, setIsNavigationVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  const fetchUserData = async () => {
    const user_id = localStorage.getItem("userID");
    let user_token = localStorage.getItem("token");
    const refresh_token = localStorage.getItem("refreshToken");

    if (!user_id || !user_token) {
      console.error("Brak ID użytkownika lub tokena w localStorage");
      handleLogout();
      return;
    }

    try {
      const response = await fetch(
        `https://quizzler-backend-1.onrender.com/api/users/profile/${user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_token}`,
          },
        }
      );

      if (response.status === 403) {
        user_token = await refreshAccessToken(refresh_token);
        if (user_token) return fetchUserData();
        // handleLogout();
      }

      if (response.status === 401) {
        console.warn("Token wygasł. Próba odświeżenia...");
        user_token = await refreshAccessToken(refresh_token);
        if (user_token) return fetchUserData(); // Ponowna próba po odświeżeniu tokena
      }

      if (!response.ok) throw new Error("Błąd pobierania danych użytkownika");

      const data = await response.json();
      setImgUrl(data.img_url);
    } catch (error) {
      console.log(""); // very funny fix (I dont know how to JavaScript)
      // console.error("Błąd pobierania użytkownika:", error);
    }
  };

  const refreshAccessToken = async (refresh_token) => {
    if (!refresh_token) {
      console.error("Brak refresh tokena. Wylogowanie...");
      handleLogout();
      return null;
    }

    try {
      const response = await fetch(
        "https://quizzler-backend-1.onrender.com/api/auth/refresh-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: refresh_token }),
        }
      );

      if (!response.ok) {
        console.error("Nie udało się odświeżyć tokena. Wylogowanie...");
        handleLogout();
        return null;
      }

      const data = await response.json();
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("token", data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error("Błąd odświeżania tokena:", error);
      handleLogout();
      return null;
    }
  };

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#0a410a",
        padding: "0 16px",
        height: "64px",
      }}
    >
      {/* Lewa sekcja: Nawigacja */}
      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        {viewportWidth >= 768 ? (
          <>
            <Link to="/categories">
              <Button type="text" style={{ color: "white" }}>
                Kategorie
              </Button>
            </Link>
            <Link to="/add-quiz">
              <Button type="text" style={{ color: "white" }}>
                Dodaj Quiz
              </Button>
            </Link>
          </>
        ) : (
          <MenuOutlined
            style={{ fontSize: 24, color: "white", cursor: "pointer" }}
            onClick={() => setIsNavigationVisible(true)}
          />
        )}
      </div>

      <div style={{ textAlign: "center", flex: 1 }}>
        <Link to="/">
          <h1 style={{ color: "white", fontSize: "24px", margin: 0 }}>
            QUIZZLER
          </h1>
        </Link>
      </div>

      {/* Prawa sekcja: SearchBar + Konto/Logowanie */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flex: 1,
        }}
      >
        {viewportWidth >= 768 ? (
          <>
            {/* Pasek wyszukiwania */}
            <div style={{ marginRight: "12px" }}>
              <SearchBar />
            </div>

            {/* Avatar użytkownika */}
            {isLoggedIn && (
              <div style={{ marginLeft: "6px", marginRight: "6px" }}>
                <Link to="/profile">
                  <Avatar
                    src={imgUrl || <UserOutlined />}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "white",
                      width: "40px",
                      height: "40px",
                    }}
                  />
                </Link>
              </div>
            )}

            {/* Przycisk wylogowania */}
            {isLoggedIn ? (
              <Button
                type="primary"
                style={{
                  backgroundColor: "#0a410a",
                  color: "white",
                  border: "none",
                  marginRight: "5px",
                }}
                onClick={handleLogout}
              >
                Wyloguj się
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#0a410a",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Zaloguj się
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#0a410a",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Zarejestruj się
                  </Button>
                </Link>
              </>
            )}
          </>
        ) : (
          <SearchOutlined
            style={{ fontSize: 24, color: "white", cursor: "pointer" }}
            onClick={() => setIsSearchVisible(true)}
          />
        )}
      </div>

      {/* Drawer dla nawigacji w trybie mobilnym */}
      <Drawer
        open={isNavigationVisible}
        onClose={() => setIsNavigationVisible(false)}
        placement="left"
        width={250}
        bodyStyle={{ backgroundColor: "#052b05", display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}
        headerStyle={{ backgroundColor: "#052b05", borderBottom: "none" }}
      >
        <Menu
          mode="vertical"
          theme="dark"
          style={{ backgroundColor: "#052b05", textAlign: "center" }}
          items={[
            { key: "1", label: <Link to="/categories">Kategorie</Link> },
            { key: "2", label: <Link to="/add-quiz">Dodaj Quiz</Link> },
            isLoggedIn
              ? { key: "3", label: <Link to="/profile">Konto</Link> }
              : { key: "4", label: <Link to="/login">Zaloguj się</Link> },
            isLoggedIn
              ? {
                  key: "5",
                      label: <Button onClick={handleLogout}>Wyloguj się</Button>,
                }
              : {
                  key: "6",
                  label: <Link to="/register">Zarejestruj się</Link>,
                },
          ]}
        />
      </Drawer>

      {/* Drawer dla wyszukiwania na małych ekranach */}
      <Drawer
        open={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
        placement="top"
        height="100vh"
        bodyStyle={{
          backgroundColor: "#052b05",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
        headerStyle={{ backgroundColor: "#052b05", borderBottom: "none" }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            paddingTop: "20px",
          }}
        >
          <SearchBar />
        </div>
        <Button
          type="default"
          style={{
            marginTop: "20px",
            backgroundColor: "white",
            color: "#0a410a",
            fontWeight: "bold",
            fontSize: "16px",
          }}
          onClick={() => setIsSearchVisible(false)}
        >
          Zamknij
        </Button>
      </Drawer>
    </Header>
  );
};

export default PageHeader;
