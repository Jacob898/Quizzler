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




const ProfilePage = () => {
    return (
        <Layout>
            <PageHeader />
            <div style={{ textAlign: "center", padding: 40, minHeight: "86vh" }}>

                <img src={dummyUser.profilePictureUrl} alt={"profilePictureUrl"}
                     style={{width: "10vw", borderRadius: "50%" }}/>

                <h1 style={{
                    padding: "20px",
                    fontSize: "4vh"
                }}>{dummyUser.username}</h1>
            </div>

            <PageFooter/>

        </Layout>
    )
}

export default ProfilePage;