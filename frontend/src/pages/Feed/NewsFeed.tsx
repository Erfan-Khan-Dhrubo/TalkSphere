import React, { useEffect, useState } from "react";
import SinglePost from "../../components/feed/newsFeed/SinglePost";
import TrendingPost from "../../components/feed/newsFeed/TrendingPost";
import backendApi from "../../utilities/axios";

interface PostType {
  _id: string;
  title: string;
  content: string;
  author: string;
  userId: string;
  userImage?: string;
  image?: string;
  upVotes: string[];
  downVotes: string[];
  commentCount: number;
  createdAt: string;
}

const NewsFeed: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await backendApi.get("/posts");
        const allPosts: PostType[] = res.data;

        setPosts(allPosts);

        // Sort posts by number of upvotes descending
        const topTrending = [...allPosts]
          .sort((a, b) => b.upVotes.length - a.upVotes.length)
          .slice(0, 3); // get top 3
        setTrendingPosts(topTrending);
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
      {trendingPosts.length > 0 && (
        <TrendingPost trendingPosts={trendingPosts} />
      )}
      <div>
        <h2 className="text-2xl font-bold pt-10 max-w-2xl mx-auto">
          Latest Posts
        </h2>
        <div className="flex items-center justify-between text-gray-600 text-sm border-t border-gray-200 pt-2 max-w-2xl mx-auto"></div>
        <div className="flex flex-col gap-8">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts available</p>
          ) : (
            posts.map((post: any) => <SinglePost key={post._id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
