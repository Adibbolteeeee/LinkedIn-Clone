import NavBarComponent from "@/Components/Navbar";
import UserLayout from "@/layout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { useState, useEffect } from "react";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";
function LoginComponent() {
  const authState = useSelector((state) => state.auth);

  const router = useRouter();

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if(localStorage.getItem("token")) {
      router.push("/dashboard")
    }
  })

  useEffect(() => {
    dispatch(emptyMessage());
  },[userLoginMethod])

  const handleRegister = () => {
    console.log("registering");
    dispatch(registerUser({ username, password, email, name }));

  };

  const handleLogin = () => {
    console.log("Login...")
    dispatch(loginUser({email, password}))
  }
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardLeft_heading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message}
            </p>
            <div className={styles.inputContainer}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <input
                type="text"
                className={styles.inputField}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className={styles.inputField}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className={styles.buttonWithOutline}>
                <p
                  onClick={() => {
                    if (userLoginMethod) {
                      handleLogin()
                    } else {
                      handleRegister();
                    }
                  }}
                >
                  {userLoginMethod ? "Sign In" : "Sign Up"}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.cardContainer_right}>

              <p> {!userLoginMethod ? "Already Have an Account ?" : "Not Have an Account ?"}</p>
              <div onClick={() => {
                    setUserLoginMethod(!userLoginMethod);
                  }} style={{color :"black", textAlign :"center"}} className={styles.buttonWithOutline} >
                  <p>{!userLoginMethod ? "Sign In" : "Sign Up"}
                </p>   
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
