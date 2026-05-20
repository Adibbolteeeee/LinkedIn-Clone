import React from "react";
import styles from "./style.module.css";
import { Router, useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

export default function NavBarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1
          style={{ cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
        >
          Pro Connect
        </h1>

        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched && (
            <div>
              <div style={{ display: "flex", gap: "1.2rem" }}>
                <p onClick={(() => {
                  router.push("/profile")
                })} style={{ fontWeight: "bold", cursor: "pointer" }}>Profile</p>
                <p style={{cursor:"pointer", fontWeight:"bold"}}
                  onClick={() => {
                      localStorage.removeItem("token");
                      router.push("/")
                      dispatch(reset());
                  }}
                > Logout</p>
              </div>
            </div>
          )}

          {!authState.profileFetched && (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
          )}
        </div>
      </nav>
    </div>

    
  );
}
