import { getAllUsers } from '@/config/redux/action/authAction';
import UserLayout from '@/layout'
import DashboardLayout from '@/layout/DashboardLayout'
import React, { use, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./discover.module.css"
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';
export default function DiscoverPage() {


  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  useEffect(()=> {
    if(!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  },[])

  return (
    <UserLayout>

        <DashboardLayout>

            <div>
                
                <div className={styles.allUserProfiles}>
                  <h1 style={{ marginLeft: '1rem' }}>Discover Page</h1>

                    {
                      authState.all_profiles_fetched && authState.all_users.map((user,index) => (
                        <div key={user.userId._id} className={styles.userProfileCard} onClick={(()=> {
                          router.push(`/view_profile/${user.userId.username}`);
                        })}>
                          <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt={user.userId.name} />
                          <div className={styles.userInfo}>
                            <h2>{user.userId.name}</h2>
                            <p>@{user.userId.username}</p>
                          </div>
                        </div>
                      ))
                    }
                </div>
            </div>

        </DashboardLayout>

    </UserLayout>
  )
}
