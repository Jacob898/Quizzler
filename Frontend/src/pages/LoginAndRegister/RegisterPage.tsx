import { Button, Form, Input, Layout } from "antd";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleClickToHomePage = () => {
    navigate("/");
  };

  const handleRegister = async (values: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      alert("Hasła się nie zgadzają!");
      return;
    }

    try {
      const response = await fetch(
        "https://quizzler-backend-1.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        }
      );

      if (response.ok) {
        const siteResponse = await response.json();
        localStorage.setItem("token", siteResponse.accessToken);
        localStorage.setItem("refreshToken", siteResponse.refreshToken);
        localStorage.setItem("userID", siteResponse.user.id);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/");
      } else {
        alert("Rejestracja nie powiodła się");
      }
    } catch (error) {
      alert("Rejestracja nie powiodła się");
    }
  };

  return (
    <Layout className={styles.loginPage}>
      <LeftOutlined
        className={styles.routeBackIcon}
        onClick={handleClickToHomePage}
      />
      <div className={styles.loginContainer}>
        <h1 className={styles.loginHeader}>Zarejestruj się</h1>
        <Form name="register-form" layout="vertical" onFinish={handleRegister}>
          <Form.Item
            label={<span className={styles.inputLabel}>Nazwa Użytkownika</span>}
            name="email"
            rules={[
              { required: true, message: "Nazwa użytkownika jest wymagana" },
            ]}
          >
            <Input
              className={styles.inputField}
              placeholder="Wpisz nazwę użytkownika"
            />
          </Form.Item>

          <Form.Item
            label={<span className={styles.inputLabel}>Hasło</span>}
            name="password"
            rules={[{ required: true, message: "Hasło jest wymagane" }]}
          >
            <Input.Password
              className={styles.inputField}
              placeholder="Wpisz hasło"
            />
          </Form.Item>

          <Form.Item
            label={<span className={styles.inputLabel}>Powtórz Hasło</span>}
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Powtórzenie hasła jest wymagane" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Wpisane hasła się nie zgadzają")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              className={styles.inputField}
              placeholder="Powtórz hasło"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.loginButton}
            >
              Zarejestruj się
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
};

export default RegisterPage;

// import {Button, Form, Input, Layout} from "antd";

// import styles from './LoginPage.module.css'
// import {useNavigate} from "react-router-dom";
// import {LeftOutlined} from "@ant-design/icons";

// const RegisterPage = () => {
//     const navigate = useNavigate();

//     const handleClickToHomePage = () => {
//         navigate("/");
//     }

//     const handleRegister = async (values) => {
//         try {
//             const response = await fetch("https://quizzler-backend-1.onrender.com/api/auth/register", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     email: values.email,
//                     password: values.password,
//                 }),
//             });

//             if (response.ok) {
//                 console.log("User registered successfully ");
//                 const siteResponse = await response.json();
//                 localStorage.setItem("token", siteResponse.accessToken);
//                 localStorage.setItem("refreshToken", siteResponse.refreshToken);
//                 localStorage.setItem("userID", siteResponse.user.id);
//                 localStorage.setItem("isLoggedIn", "true");
//                 navigate("/");
//             } else {
//                 const error = await response.json();
//                 console.error("Registration failed: ", error );
//                 alert("Rejestracja nie powiodła się");
//             }
//         } catch (error) {
//             console.error("error occured while registering: ", error);
//             alert("Rejestracja nie powiodła się");
//         }
//     }

//     return (
//         <Layout>
//             <div className={styles.loginPage} >
//                 <div className={styles.logoSection}>
//                     <LeftOutlined className={styles.routeBackIcon} onClick={handleClickToHomePage} />
//                     <div className={styles.logo}>Logo-placeholder</div>
//                 </div>

//                 <div className={styles.loginContainer}>
//                     <h1 className={styles.loginHeader}>Zarejestruj się</h1>
//                     <Form
//                         name="login-form"
//                         layout="vertical"
//                         onFinish={handleRegister}
//                     >
//                         <Form.Item label="Nazwa Użytkownika"
//                                    name="email"
//                                    rules={[{required: true, message:"Nazwa użytkownika jest wymagana"}]}
//                         >
//                             <Input />
//                         </Form.Item>

//                         <Form.Item label="Hasło"
//                                    name="password"
//                                    rules={[{required: true, message:"Hasło jest wymagane"}]}
//                         >
//                             <Input.Password />
//                         </Form.Item>

//                         <Form.Item label="Powtórz Hasło"
//                                    name = "confirm password"
//                                    dependencies={['password']}
//                                    rules ={[
//                                        {
//                                            required: true,
//                                            message: "Powtórzenie hasła jest wymagane",
//                                        },
//                                        ({ getFieldValue }) => ({
//                                            validator(_, value) {
//                                                if (!value || getFieldValue('password') === value) {
//                                                    return Promise.resolve();
//                                                }
//                                                return Promise.reject(new Error("Wpisane hasła się nie zgadzają"));
//                                            }
//                                        })
//                                    ]}
//                         >
//                             <Input.Password />
//                         </Form.Item>

//                         <Form.Item>
//                             <Button type="primary" htmlType="submit" className={styles.loginButton}>
//                                 Zarejestruj się
//                             </Button>
//                         </Form.Item>
//                     </Form>
//                 </div>
//             </div>
//         </Layout>
//     )
// }

// export default RegisterPage;
