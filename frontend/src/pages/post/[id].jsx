import { useRouter } from "next/router";

const PostPage = () => {
  const router = useRouter();

  const { id } = router.query;

  return (
    <div>
      <h1>Post ID: {id}</h1>
    </div>
  );
};

export default PostPage;