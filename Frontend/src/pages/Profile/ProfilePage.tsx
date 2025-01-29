import {Avatar, Layout} from "antd";
import PageHeader from "../../components/PageHeader.tsx";
import PageFooter from "../../components/PageFooter.tsx";
import {useEffect, useState} from "react";
import {UserOutlined} from "@ant-design/icons";



const usersQuizzes = [
    {
        quizTitle: "quiz 1",
        quizImageUrl: "https://fakeimg.pl/200x100",
        quizResult: "odpowiedź 1",
        quizRating: 5
    },
    {
        quizTitle: "quiz 2",
        quizImageUrl: "https://fakeimg.pl/200x100",
        quizResult: "odpowiedź 3",
        quizRating: 3
    }
];




const ProfilePage = () => {

    const [username, setUsername] = useState("");
    const [imgUrl, setImgUrl] = useState("");
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

        fetchUserData();
        
    },[])

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
                    padding: "20px",
                    fontSize: "8vh"
                }}>{username}</p>

                <p style={{
                    padding: "20px",
                    fontSize: "4vh",
                }}>Historia Quizów</p>

                <div>
                    {usersQuizzes.map((quiz,index) => (
                        <div key={index} style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            margin: "20px",
                        }}>

                            <div style={{
                                padding: "20px",
                            }}>
                                <img src={quiz.quizImageUrl} alt={"quizImage"}></img>
                            </div>

                            <div style={{
                                padding: "20px",
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                            }}>
                                {quiz.quizTitle}
                                {quiz.quizResult}
                                {quiz.quizRating}

                            </div>

                        </div>
                    ))}
                </div>



            </div>

            <PageFooter/>

        </Layout>
    )
}

export default ProfilePage;