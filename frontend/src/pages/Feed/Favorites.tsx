import React, { useEffect, useState, useContext } from "react";
import SinglePost from "../../components/feed/newsFeed/SinglePost";
import { AuthContext } from "../../config/AuthPorvider";
import backendApi from "../../utilities/axios";

const Favorites: React.FC = () => {
  const { presentUser } = useContext(AuthContext);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Fetch all posts
        const res = await backendApi.get("/posts");

        if (presentUser?.savedPosts?.length) {
          // Filter posts where post._id exists in presentUser.savedPosts
          const filteredFavorites = res.data.filter((post: any) =>
            presentUser.savedPosts.includes(post._id)
          );

          setFavorites(filteredFavorites);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [presentUser]);

  if (loading) {
    return <p className="text-center mt-10">Loading favorites...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Favorites</h1>
        <span className="text-gray-500 text-sm">{favorites.length} posts</span>
      </div>

      <hr className="border-gray-300" />

      {/* Favorite Posts */}
      {favorites.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          You have no favorite posts yet.
        </p>
      ) : (
        favorites.map((post) => <SinglePost key={post._id} post={post} />)
      )}
    </div>
  );
};

export default Favorites;
