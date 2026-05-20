import { BASE_URL, clientServer } from "@/config";
import UserLayout from "@/layout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useSearchParams } from "next/navigation";
import styles from "./view_profile.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useEffect, useState } from "react";
import {
  getConnectionsRequest,
  getMyConnectionRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";
export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const postState = useSelector((state) => state.posts);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUserPosts = async () => {
    await dispatch(getAllPosts());
    await dispatch(
      getConnectionsRequest({ token: localStorage.getItem("token") }),
    );
    await dispatch(getMyConnectionRequests({token : localStorage.getItem("token")}))
  };

  useEffect(() => {
    getUserPosts();
  }, []);

  useEffect(() => {
    let post = postState.posts.filter((post) => {
      return post.userId.username === userProfile.userId.username;
    });
    setUserPosts(post);
  }, [postState.posts]);

  useEffect(() => {
    console.log(authState.connections, userProfile.userId._id);
    if (
      authState.connections.some(
        (user) => user.connectionId._id === userProfile.userId._id,
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
      authState.connections.find(
        (user) => user.connectionId._id === userProfile.userId._id,
      )?.status_accepted === true
    ) {
      setIsConnectionNull(false);
    } 
    }
    
    if (
      authState.connectionRequests.some(
        (user) => user.userId._id === userProfile.userId._id,
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
      authState.connectionRequests.find(
        (user) => user.userId._id === userProfile.userId._id,
      )?.status_accepted === true
    ) {
      setIsConnectionNull(false);
    } 
    }
  }, [authState.connections, authState.connectionRequests]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.profileContainer}>
          <div className={styles.backDropContainer}>
            <img
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt={userProfile.userId.name}
              className={styles.backDropImage}
            />
          </div>

          <div className={styles.profileContainer_details}>
          <div className={styles.profileContainer_flex}>
              <div style={{ flex: "0.7" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.25rem",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "gray" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>

                <div style={{ display: "flex" }} className={styles.buttonContainer}>
                  {isCurrentUserInConnection ? (
                    <button className={styles.connectedButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            connectionId: userProfile.userId._id,
                          }),
                        );
                      }}
                      className={styles.connectButton}
                    >
                      Connect
                    </button>
                  )}
                  <div title="Download Resume" onClick={async() => {
                    const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                    window.open(`${BASE_URL}/${response.data.url}`, "_blank");
                  }} style={{cursor:"pointer"}} className={styles.messageButton}>
                    <svg style={{height:"1.5rem"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>

                  </div>

                </div>

                <div>
                  <p>{userProfile.bio}</p>
                </div>
              </div>

              <div style={{ flex: "0.3" }}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media !== "" ? (
                            <img
                              src={`${BASE_URL}/${post.media}`}
                              alt="post media"
                              className={styles.postMedia}
                            />
                          ) : (
                            <div
                              style={{ width: "3.4rem", height: "3.4rem" }}
                            ></div>
                          )}
                        </div>

                        <p>{post.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.workHistory}>
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {userProfile.pastWork.map((work, index) => (
                <div key={index} className={styles.workHistoryCard}>
                  <p
                    style={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                    }}
                  >
                    {work.position} at {work.company}
                  </p>
                  <p>{work.years} </p>
                </div>
              ))}
            </div>
          </div>


          <div className={styles.educationHistory}>
            <h4>Education</h4>
            <div className={styles.educationHistoryContainer}>
              {userProfile.education.map((education, index) => (
                <div key={index} className={styles.educationHistoryCard}>
                  <p
                    style={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                    }}
                  >
                    {education.school} - {education.degree}
                  </p>
                  <p>{education.fieldOfStudy} </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: {
        username: context.query.username,
      },
    },
  );
  const response = request.data;
  console.log(response);

  return {
    props: {
      userProfile: response.user,
    },
  };
}
