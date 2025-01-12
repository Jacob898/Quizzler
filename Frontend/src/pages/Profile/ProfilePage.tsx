import {Layout} from "antd";
import PageHeader from "../../components/PageHeader.tsx";
import PageFooter from "../../components/PageFooter.tsx";

interface userProfile {
   username: string;
   profilePictureUrl: string;

}

const dummyUser: userProfile = {
    username: "RyanGosling",
    profilePictureUrl: "https://fwcdn.pl/fph/48/00/754800/1151700_2.8.jpg",
}

interface quiz {
    quizTitle: string;
    quizImageUrl: string;
    quizResult: string;
    quizRating: number;

}

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
    return (
        <Layout>
            <PageHeader />
            <div style={{ textAlign: "center", padding: 40, minHeight: "86vh" }}>

                <img src={dummyUser.profilePictureUrl} alt={"profilePictureUrl"}
                     style={{width: "10vw", borderRadius: "50%" }}/>

                <p style={{
                    padding: "20px",
                    fontSize: "8vh"
                }}>{dummyUser.username}</p>

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
                                <img src={quiz.quizImageUrl}></img>
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