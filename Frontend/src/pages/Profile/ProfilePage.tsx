import {Avatar, Layout} from "antd";
import PageHeader from "../../components/PageHeader.tsx";
import PageFooter from "../../components/PageFooter.tsx";
import {useEffect, useState} from "react";
import {UserOutlined} from "@ant-design/icons";





const ProfilePage = () => {

    const [username, setUsername] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [userQuizzes, setUserQuizzes] = useState([]);
    const user_id = localStorage.getItem("userID");
    const user_token  = localStorage.getItem("token");


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://quizzler-backend-1.onrender.com/api/users/profile/${user_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${user_token}`
                    }
                });
                const data = await response.json();
                setUsername(data.email);
                setImgUrl(data.img_url);
            } catch (error) {
                console.log(error);
            }
        }

        const fetchQuizHistoryData = async () => {
            try {
                const response = await fetch(`https://quizzler-backend-1.onrender.com/api/quiz-history/user-results/${user_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${user_token}`
                    }
                });
                const data = await response.json();
                setUserQuizzes(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserData();
        fetchQuizHistoryData();
    },[user_id, user_token])

    const formatDateTime = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }) + " " + date.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    return (
        <Layout>
            <PageHeader />
            <div style={{ textAlign: "center", padding: 40, minHeight: "86vh" }}>

                {(imgUrl === null || imgUrl === undefined) ?
                    (
                    <Avatar
                        icon={<UserOutlined />}
                        style={{ height: "10vw", width: "10vw" }}
                    />)
                    :
                    (<img src={imgUrl} alt={"profilePictureUrl"}
                     style={{width: "10vw",height: "10vw", borderRadius: "50%" }}/>
                    )}

                <p style={{
                    padding: "5vh",
                    fontSize: "8vh"
                }}>{username}</p>

                <p style={{
                    padding: "20px",
                    fontSize: "4vh",
                }}>Historia Quizów</p>

                <div style={{ display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center", }}>
                    {userQuizzes.length > 0 ? (
                        userQuizzes.map((quiz,index) => (
                                <div key={index} style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "60vh",
                                    height: "20vh",
                                    margin: "20px",
                                    padding: "20px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid #ddd",
                                    borderRadius: "10px",
                                    maxWidth: "400px",
                                    backgroundColor: "black",
                                    gap: "3vh",
                                }}>

                                        <h3>{quiz.quiz.name}</h3>
                                        <p>Wynik: {quiz.result.title}</p>
                                        <small>{formatDateTime(quiz.takenAt)}</small>

                                </div>
                            ))
                    ) : (
                        <h2 style={{margin: "5vh"}}>Brak historii quizów</h2>
                        )}
                </div>
            </div>

            <PageFooter/>

        </Layout>
    )
}

export default ProfilePage;