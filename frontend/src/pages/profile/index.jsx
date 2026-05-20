import { getAboutUser } from "@/config/redux/action/authAction";
import UserLayout from "@/layout";
import DashboardLayout from "@/layout/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./profile.module.css";
import { BASE_URL, clientServer } from "@/config";
import { getAllPosts } from "@/config/redux/action/postAction";

function ProfilePage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const [userPosts, setUserPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false); // Changed
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false); // Changed
  const [workData, setWorkData] = useState({ company: "", position: "", years: 0 });
  const [educationData, setEducationData] = useState({ school: "", degree: "", fieldOfStudy: "" });

  const handleEducationData = (e) => {
    const { name, value } = e.target;
    setEducationData({ ...educationData, [name]: value });
  };

  const handleAddWork = (e) => {
    const { name, value } = e.target;
    setWorkData({ ...workData, [name]: value });
  };

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    if (authState.user) {
      setUserProfile(authState.user);
    }
  }, [authState.user]);

  useEffect(() => {
    let post = postState.posts.filter((post) => {
      return post.userId?.username === userProfile?.userId?.username;
    });
    setUserPosts(post);
  }, [postState.posts, userProfile]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    const response = await clientServer.post("/update_user", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    const response2 = await clientServer.post("/update_profile", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  // Reset work form
  const resetWorkForm = () => {
    setWorkData({ company: "", position: "", years: 0 });
  };

  // Reset education form
  const resetEducationForm = () => {
    setEducationData({ school: "", degree: "", fieldOfStudy: "" });
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {console.log(userPosts)}
        {authState.user && userProfile?.userId && (
          <div className={styles.profileContainer}>
            <div className={styles.backDropContainer}>
              <div className={styles.profileImageContainer}>
                <img
                  src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                  alt={userProfile?.userId?.name || ""}
                  className={styles.backDropImage}
                />
                <label
                  className={styles.backDrop_overlay}
                  htmlFor="profilePictureUpload"
                >
                  <p>Edit</p>
                </label>
                <input
                  type="file"
                  id="profilePictureUpload"
                  className={styles.profilePictureInput}
                  onChange={(e) => updateProfilePicture(e.target.files[0])}
                />
              </div>
            </div>
            <div className={styles.profileContainer_details}>
              <div>
                <div className={styles.profileContainer_flex}>
                  <div className={styles.nameEdit_container}>
                    <input
                      type="text"
                      className={styles.nameEdit}
                      value={userProfile?.userId?.name || ""}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });
                      }}
                    />
                    <p style={{ color: "gray" }}>
                      @{userProfile?.userId?.username || ""}
                    </p>
                  </div>

                  <div>
                    <textarea
                      name="userBio"
                      id=""
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                      }}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      style={{ width: "100%" }}
                    ></textarea>
                  </div>
                </div>

                
              </div>
            </div>

            <div className={styles.workHistory}>
              <h4>Work History</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork?.map((work, index) => (
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
                    <p>
                      {" "}
                      <b>Experience :</b> {work.years} Years{" "}
                    </p>
                  </div>
                ))}
                <input type="text" style={{ display: "none" }} id="addWork" />
                <button
                  className={styles.addWorkBtn}
                  name="addWork"
                  onClick={() => {
                    setIsWorkModalOpen(true); // Changed
                    resetWorkForm(); // Reset form when opening
                  }}
                >
                  Add Work
                </button>
              </div>
            </div>

            <div className={styles.educationHistory}>
              <h4>Education</h4>
              <div className={styles.educationHistoryContainer}>
                {userProfile.education?.map((education, index) => (
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
                <input type="text" style={{ display: "none" }} id="addWork" />
                <button
                  className={styles.addWorkBtn}
                  name="education"
                  onClick={(e) => {
                    setIsEducationModalOpen(true); // Changed
                    resetEducationForm(); // Reset form when opening
                  }}
                >
                  Add Education
                </button>
              </div>
            </div>

            {userProfile != authState.user && (
              <div
                className={styles.updateProfileBtn}
                onClick={() => {
                  updateProfileData();
                }}
              >
                Update Profile
              </div>
            )}
          </div>
        )}

        {/* Add Work Modal - Only shows when isWorkModalOpen is true */}
        {isWorkModalOpen && (
          <div
            className={styles.commentsContainer}
            onClick={() => {
              setIsWorkModalOpen(false);
            }}
          >
            <div
              className={styles.allCommentsContainer}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <input
                type="text"
                onChange={handleAddWork}
                name="company"
                className={styles.inputField}
                placeholder="Enter Company"
                value={workData.company}
              />
              <input
                type="text"
                onChange={handleAddWork}
                name="position"
                className={styles.inputField}
                placeholder="Enter Position"
                value={workData.position}
              />
              <input
                type="number"
                onChange={handleAddWork}
                name="years"
                className={styles.inputField}
                placeholder="Years of Experience"
                
              />
              <div
                className={styles.updateProfileBtn}
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    pastWork: [...(userProfile.pastWork || []), workData],
                  });
                  setIsWorkModalOpen(false);
                  resetWorkForm(); // Reset after adding
                }}
              >
                Add Work
              </div>
            </div>
          </div>
        )}

        {/* Add Education Modal - Only shows when isEducationModalOpen is true */}
        {isEducationModalOpen && (
          <div
            className={styles.commentsContainer}
            onClick={() => {
              setIsEducationModalOpen(false);
            }}
          >
            <div
              className={styles.allCommentsContainer}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <input
                type="text"
                onChange={handleEducationData}
                name="school"
                className={styles.inputField}
                placeholder="Enter School Name"
                value={educationData.school}
              />
              <input
                type="text"
                onChange={handleEducationData}
                name="degree"
                className={styles.inputField}
                placeholder="Enter Degree"
                value={educationData.degree}
              />
              <input
                type="text"
                onChange={handleEducationData}
                name="fieldOfStudy"
                className={styles.inputField}
                placeholder="Enter Field of Study"
                value={educationData.fieldOfStudy}
              />
              <div
                className={styles.updateProfileBtn}
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    education: [...(userProfile.education || []), educationData],
                  });
                  setIsEducationModalOpen(false);
                  resetEducationForm(); // Reset after adding
                }}
              >
                Add Education
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}

export default ProfilePage;