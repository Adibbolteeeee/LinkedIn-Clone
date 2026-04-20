import { getAboutUser } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import UserLayout from '@/layout';
import DashboardLayout from '@/layout/DashboardLayout';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
export default function Dashboard() {

  const router = useRouter();
  const [isToken, setIsToken] = useState(false);

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  useEffect(() => {

    if(localStorage.getItem("token") === null ){
      router.push("/login")
    }
    setIsToken(true);
  });

  useEffect(() => {
    if(isToken) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({token : localStorage.getItem("token")}));
    }
  },[isToken])

  return (
    <UserLayout>
        <DashboardLayout>
          <h1>Dashboard</h1>
        </DashboardLayout>
    </UserLayout>
  )
}
