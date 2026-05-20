import { BASE_URL, clientServer } from '@/config';
import { acceptConnection, getMyConnectionRequests } from '@/config/redux/action/authAction';
import UserLayout from '@/layout'
import DashboardLayout from '@/layout/DashboardLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./index.module.css";
import { useRouter } from 'next/router';
import { connection } from 'next/server';

export default function MyConnectionsPage() {

  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  
  useEffect(() => {
    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  }, [])

  useEffect(() => {
    console.log(authState.connectionRequests);
  }, [authState.connectionRequests])

  const connectionRequests = authState.connectionRequests?.filter(
    (connection) => connection.status_accepted === null
  ) || [];
  
  const myConnections = authState.connectionRequests?.filter(
    (connection) => connection.status_accepted === true
  ) || [];

  return (
    <UserLayout>
      <DashboardLayout>
        <div style={{display: "flex", flexDirection: "column", gap: "3rem"}}>
          
          {/* Connection Requests Section */}
          <div>
            <h1>My Connection Requests</h1>
            {connectionRequests.length === 0 && (
              <p style={{textAlign: "center", marginTop: "2rem"}}>No Connection Requests</p>
            )}
            
            <div className={styles.requestsContainer}>
              {connectionRequests.length > 0 && connectionRequests.map((user, index) => (
                <div className={styles.cards} key={user._id}>
                  <div className={styles.userCard}>
                    <div className={styles.userCard_card}>
                      <div 
                        className={styles.profilePicture} 
                        onClick={() => {
                          router.push(`/view_profile/${user.userId.username}`);
                        }}
                      >
                        <img 
                          src={`${BASE_URL}/${user.userId.profilePicture}`} 
                          alt={user.userId.name}
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                      </div>

                      <div className={styles.userInfo}>
                        <h3 style={{fontWeight: "bold"}}>{user.userId.name}</h3>
                        <p>@{user.userId.username}</p>
                      </div>
                    </div>
                    
                    <button 
                      className={styles.connectedButton} 
                      onClick={() => {
                        dispatch(acceptConnection({ 
                          token: localStorage.getItem("token"), 
                          requestId: user._id, 
                          action: "accept" 
                        }));
                        dispatch(getMyConnectionRequests({token: localStorage.getItem("token")}));
                      }}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Connections Section */}
          <div>
            <h1>My Connections</h1>
            {myConnections.length === 0 && (
              <p style={{textAlign: "center", marginTop: "2rem"}}>No Connections Yet</p>
            )}
            
            <div className={styles.connectionsContainer}>
              {myConnections.length > 0 && myConnections.map((user, index) => (
                <div className={styles.cards} key={user._id}>
                  <div className={styles.userCard}>
                    <div className={styles.userCard_card}>
                      <div 
                        className={styles.profilePicture} 
                        onClick={() => {
                          router.push(`/view_profile/${user.userId.username}`);
                        }}
                      >
                        <img 
                          src={`${BASE_URL}/${user.userId.profilePicture}`} 
                          alt={user.userId.name}
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                      </div>

                      <div className={styles.userInfo}>
                        <h3 style={{fontWeight: "bold"}}>{user.userId.name}</h3>
                        <p>@{user.userId.username}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}