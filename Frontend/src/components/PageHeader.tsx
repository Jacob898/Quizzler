import React, { useState, useEffect } from "react";
import { Layout, Menu, Drawer, Button, Avatar, Input } from "antd";
import {
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const { Header } = Layout;

const PageHeader = () => {
  const [isNavigationVisible, setIsNavigationVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const user_id = localStorage.getItem("userID");
  const user_token = localStorage.getItem("token");

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(status);

    if (status) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `https://quizzler-backend-1.onrender.com/api/users/profile/${user_id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user_token}`,
              },
            }
          );
          const data = await response.json();
          setImgUrl(data.img_url);
        } catch (error) {
          console.log(error);
        }
      };

      fetchUserData();
    }
  }, [user_id, user_token]);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
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
              <Button
                type="text"
                style={{
                  color: "white",
                  backgroundColor: "#0a410a",
                  border: "none",
                }}
              >
                Kategorie
              </Button>
            </Link>
            <Link to="/add-quiz">
              <Button
                type="text"
                style={{
                  color: "white",
                  backgroundColor: "#0a410a",
                  border: "none",
                }}
              >
                Dodaj Quiz
              </Button>
            </Link>
          </>
        ) : (
          <MenuOutlined
            style={{
              fontSize: 24,
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => setIsNavigationVisible(true)}
          />
        )}
      </div>

      {/* Środek: QUIZZLER zamiast loga */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          height: "100%",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1
            style={{
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
              margin: 0,
              letterSpacing: "2px",
            }}
          >
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
          gap: "12px",
        }}
      >
        {viewportWidth >= 768 ? (
          <>
            <SearchBar />
            {isLoggedIn ? (
              <>
                <Link to="/profile">
                  <Avatar
                    src={imgUrl || <UserOutlined />}
                    style={{ cursor: "pointer", backgroundColor: "white" }}
                  />
                </Link>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#0a410a",
                    color: "white",
                    border: "none",
                  }}
                  onClick={handleLogout}
                >
                  Wyloguj się
                </Button>
              </>
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
            style={{
              fontSize: 24,
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => setIsSearchVisible(true)}
          />
        )}
      </div>

      {/* Drawer dla NAWIGACJI na małych ekranach */}
      <Drawer
        open={isNavigationVisible}
        onClose={() => setIsNavigationVisible(false)}
        placement="left"
        width={250}
        bodyStyle={{ backgroundColor: "#052b05" }}
        headerStyle={{ display: "none" }}
      >
        <Menu
          mode="vertical"
          theme="dark"
          style={{ backgroundColor: "#052b05" }}
          items={[
            { key: "1", label: <Link to="/categories">Kategorie</Link> },
            { key: "2", label: <Link to="/add-quiz">Dodaj Quiz</Link> },
            isLoggedIn
              ? { key: "3", label: <Link to="/profile">Konto</Link> }
              : { key: "4", label: <Link to="/login">Zaloguj się</Link> },
            isLoggedIn
              ? {
                  key: "5",
                  label: (
                    <Link to="/" onClick={handleLogout}>
                      Wyloguj się
                    </Link>
                  ),
                }
              : {
                  key: "6",
                  label: <Link to="/register">Zarejestruj się</Link>,
                },
          ]}
          onClick={() => setIsNavigationVisible(false)}
        />
      </Drawer>

      {/* Drawer dla WYSZUKIWANIA na małych ekranach */}
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
          height: "100vh",
        }}
        headerStyle={{ display: "none" }}
      >
        <SearchBar />

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
      {/* <Drawer
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
          justifyContent: "center",
          height: "100vh",
        }}
        headerStyle={{ display: "none" }}
      >
        <h2 style={{ color: "white", marginBottom: "10px", fontSize: "24px" }}>
          Szukaj quizu
        </h2>
        <SearchBar />
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
      </Drawer> */}
    </Header>
  );
};

export default PageHeader;

// import React, { useState, useEffect } from "react";
// import { Layout, Menu, Drawer, Button, Avatar } from "antd";
// import {
//   MenuOutlined,
//   SearchOutlined,
//   UserOutlined,
//   CloseOutlined,
// } from "@ant-design/icons";
// import logo from "../assets/logo_temp.svg";
// import { colors } from "../constants/colors";
// import { useNavigate, Link } from "react-router-dom";
// import SearchBar from "./SearchBar";

// const { Header } = Layout;

// interface PageHeaderProps {
//   isLoggedIn: boolean;
//   user: { name: string };
//   onLogout: () => void;
// }

// interface SearchItem {
//   id: number;
//   title: string;
// }

// interface MenuItem {
//   key: string;
//   label: string;
//   target?: string;
//   onClick?: () => void;
//   danger?: boolean;
// }

// const PageHeader = () => {
//   const [isSearchVisible, setIsSearchVisible] = useState(false);
//   const [isNavigationVisible, setIsNavigationVisible] = useState(false);
//   const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
//   const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [imgUrl, setImgUrl] = useState("");
//   const user_id = localStorage.getItem("userID");
//   const user_token = localStorage.getItem("token");

//   useEffect(() => {
//     const status = localStorage.getItem("isLoggedIn") === "true";
//     setIsLoggedIn(status);

//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(
//           `https://quizzler-backend-1.onrender.com/api/users/profile/${user_id}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               authorization: `Bearer ${user_token}`,
//             },
//           }
//         );
//         const data = await response.json();
//         setImgUrl(data.img_url);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("token");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("userID");
//     setIsLoggedIn(false);
//     navigate("/");
//   };

//   // Quiz data - temp
//   const staticData: SearchItem[] = [];

//   // userMenuItems
//   const userMenuItems = [
//     { key: "1", label: "Konto", target: "/profile" },
//     { key: "2", label: "Wyloguj się", onClick: handleLogout, danger: true },
//   ];

//   // navigation
//   const navigation = [
//     { key: "1", label: "Kategorie", target: "/categories" },
//     { key: "2", label: "Dodaj Quiz", target: "/add-quiz" },
//   ];

//   const navigate = useNavigate();

//   const handleNavigationClick = ({ key }: { key: string }) => {
//     const { target } = navigation.find((item) => item.key === key) || {};
//     if (target) {
//       navigate(target);
//     }
//   };

//   const handleMenuClick = ({ key }: { key: string }) => {
//     const item = userMenuItems.find((menuItem) => menuItem.key === key);
//     if (item) {
//       if (item.target) {
//         navigate(item.target);
//       } else if (item.onClick) {
//         item.onClick();
//       }
//     }
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       setViewportWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <Header
//       style={{
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         backgroundColor: colors.primary,
//         padding: "0 16px",
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
//         {viewportWidth >= 768 ? (
//           <Menu
//             mode="horizontal"
//             items={navigation}
//             style={{
//               backgroundColor: colors.primary,
//               color: colors.text,
//             }}
//             onClick={handleNavigationClick}
//           />
//         ) : (
//           <MenuOutlined
//             style={{
//               fontSize: 24,
//               color: colors.text,
//               cursor: "pointer",
//             }}
//             onClick={() => setIsNavigationVisible(true)}
//           />
//         )}
//       </div>

//       <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
//         <Link to="/" style={{ display: "flex", alignItems: "center", flex: 1 }}>
//           <img src={logo} alt="logo" height="50" style={{ margin: "0 auto" }} />
//         </Link>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "flex-end",
//           flex: 1,
//         }}
//       >
//         {viewportWidth >= 950 ? (
//           <SearchBar onEnter={() => {}} />
//         ) : (
//           <SearchOutlined
//             style={{
//               fontSize: 24,
//               color: colors.text,
//               cursor: "pointer",
//               marginRight: 16,
//             }}
//             onClick={() => setIsSearchVisible(true)}
//           />
//         )}

//         {isLoggedIn && viewportWidth > 768 ? (
//           imgUrl === null || imgUrl === undefined ? (
//             <Avatar
//               icon={<UserOutlined />}
//               style={{ cursor: "pointer", marginLeft: 16 }}
//               onClick={() => setIsUserMenuVisible(true)}
//             />
//           ) : (
//             <img
//               src={imgUrl}
//               alt={"profilePictureUrl"}
//               style={{
//                 cursor: "pointer",
//                 marginLeft: 16,
//                 borderRadius: "50%",
//                 height: "3vw",
//                 width: "3vw",
//               }}
//               onClick={() => setIsUserMenuVisible(true)}
//             />
//           )
//         ) : isLoggedIn ? (
//           imgUrl === null || imgUrl === undefined ? (
//             <Avatar
//               icon={<UserOutlined />}
//               style={{ cursor: "pointer", marginLeft: 16 }}
//               onClick={() => setIsUserMenuVisible(true)}
//             />
//           ) : (
//             <img
//               src={imgUrl}
//               alt={"profilePictureUrl"}
//               style={{
//                 cursor: "pointer",
//                 marginLeft: 16,
//                 borderRadius: "50%",
//                 height: "3vw",
//                 width: "3vw",
//               }}
//               onClick={() => setIsUserMenuVisible(true)}
//             />
//           )
//         ) : (
//           <>
//             <Link to="/login">
//               <Button type="primary" style={{ marginRight: 8 }}>
//                 Zaloguj się
//               </Button>
//             </Link>
//             <Link to="/register">
//               <Button type="primary">Zarejestruj się </Button>
//             </Link>
//           </>
//         )}
//       </div>

//       <Drawer
//         open={isNavigationVisible}
//         onClose={() => setIsNavigationVisible(false)}
//         placement="left"
//         width={"100vw"}
//         height={"100vh"}
//         style={{ padding: 0 }}
//         bodyStyle={{ padding: 0, backgroundColor: colors.primary }}
//         headerStyle={{ display: "none" }}
//       >
//         <div style={{ backgroundColor: colors.primary }}>
//           <CloseOutlined
//             style={{
//               margin: 16,
//               fontSize: 24,
//               color: colors.text,
//               cursor: "pointer",
//             }}
//             onClick={() => setIsNavigationVisible(false)}
//           />
//         </div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             width: "100vw",
//             height: "90%",
//           }}
//         >
//           <Menu
//             mode="vertical"
//             items={navigation.map((item) => ({
//               ...item,
//               style: {
//                 fontSize: "24px",
//                 height: "10vh",
//                 width: "100vw",
//                 textAlign: "center",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               },
//               label: (
//                 <Link
//                   style={{
//                     fontSize: "24px",
//                     margin: "16px",
//                   }}
//                   to={item.target}
//                   onClick={() => setIsNavigationVisible(false)}
//                 >
//                   {item.label}
//                 </Link>
//               ),
//             }))}
//           />
//         </div>
//       </Drawer>

//       <Drawer
//         open={isSearchVisible}
//         onClose={() => setIsSearchVisible(false)}
//         placement="top"
//         height="100vh"
//         bodyStyle={{ backgroundColor: colors.primary, padding: "16px" }}
//         headerStyle={{ display: "none" }}
//       >
//         <div
//           style={{
//             display: "flex",
//             marginBottom: 16,
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <h2 style={{ color: "#fff", margin: 0 }}>Wyszukaj quiz</h2>
//           <CloseOutlined
//             style={{
//               fontSize: 24,
//               color: colors.text,
//               cursor: "pointer",
//             }}
//             onClick={() => setIsSearchVisible(false)}
//           />
//         </div>
//         <SearchBar
//           isMobile
//           onItemSelect={() => setIsSearchVisible(false)}
//           onEnter={() => setIsSearchVisible(false)}
//         />
//       </Drawer>

//       <Drawer
//         open={isUserMenuVisible}
//         onClose={() => setIsUserMenuVisible(false)}
//         placement="right"
//         width={"100vw"}
//         height={"100vh"}
//         style={{ padding: 0 }}
//         bodyStyle={{ padding: 0 }}
//         headerStyle={{ display: "none" }}
//       >
//         <div style={{ backgroundColor: colors.primary }}>
//           <CloseOutlined
//             style={{
//               margin: 16,
//               fontSize: 24,
//               color: colors.text,
//               cursor: "pointer",
//             }}
//             onClick={() => setIsUserMenuVisible(false)}
//           />
//         </div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             width: "100vw",
//             height: "90%",
//           }}
//         >
//           <Menu
//             mode="vertical"
//             items={userMenuItems.map((item) => ({
//               key: item.key,
//               style: {
//                 fontSize: "24px",
//                 height: "10vh",
//                 width: "100vw",
//                 textAlign: "center",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               },
//               label: item.target ? (
//                 <Link
//                   to={item.target}
//                   style={{ color: item.danger ? "red" : "inherit" }}
//                   onClick={() => setIsUserMenuVisible(false)}
//                 >
//                   {item.label}
//                 </Link>
//               ) : (
//                 <span style={{ color: item.danger ? "red" : "inherit" }}>
//                   {item.label}
//                 </span>
//               ),
//               onClick: () => {
//                 if (item.onClick) {
//                   item.onClick();
//                 }
//                 setIsUserMenuVisible(false);
//               },
//               danger: item.danger,
//             }))}
//           />
//         </div>
//       </Drawer>
//     </Header>
//   );
// };

// export default PageHeader;
