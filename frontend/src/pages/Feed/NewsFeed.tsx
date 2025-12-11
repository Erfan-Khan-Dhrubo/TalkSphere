import React, { useEffect, useState } from "react";
import SinglePost from "../../components/feed/newsFeed/SinglePost";
import backendApi from "../../utilities/axios";

const NewsFeed: React.FC = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await backendApi.get("/posts");
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available</p>
      ) : (
        posts.map((post: any) => <SinglePost key={post._id} post={post} />)
      )}
    </div>
  );
};

export default NewsFeed;
