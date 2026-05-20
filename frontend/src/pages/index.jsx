import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  return (
    <>
      <UserLayout>
        <div className={styles.container}>
          <div className={styles.mainContainer}>
            <div className={styles.mainContainer_left}>
              <p>Connect with friends without exaggeration</p>
              <p>A true social media platform, with stories no bluffs.</p>

              <div
                onClick={() => {
                  router.push("/login");
                }}
                className={styles.buttonJoin}
              >
                <p>Join Now</p>
              </div>
            </div>

            <div className={styles.mainContainer_right}>
              <Image
                src="/images/default-avatar.png"
                width={400}
                height={400}
                alt="image"
                priority
              />
            </div>
          </div>
        </div>
      </UserLayout>
    </>
  );
}
