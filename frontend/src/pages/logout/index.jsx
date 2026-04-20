import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

export default function Logout() {

    const router = useRouter();
    useEffect(() => {
        if(localStorage.getItem("token")){
            localStorage.removeItem("token");
            router.push("/login")
        }
    },[])
  return (
    <div>
      <h1>logout successful</h1>
    </div>
  )
}
