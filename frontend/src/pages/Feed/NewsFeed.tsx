import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SinglePost from "../../components/feed/newsFeed/SinglePost";

const NewsFeed: React.FC = () => {
  const [posts, setPosts] = useState<number[]>([
    1, 2, 3, 5, 6, 1, 1, 1, 11, 1, 1, 1, 1, 11, 1, 1, 11, 1, 11, 1, 11, 1,
  ]);
  const [hasMore, setHasMore] = useState(true);

  const fetchMorePosts = () => {
    // Simulate an API call
    setTimeout(() => {
      const morePosts = Array.from(
        { length: 3 },
        (_, i) => posts.length + i + 1
      );
      setPosts((prev) => [...prev, ...morePosts]);

      // Stop after 20 posts (example)
      if (posts.length + morePosts.length >= 20) {
        setHasMore(false);
      }
    }, 1000);
  };

  return (
    <InfiniteScroll
      dataLength={posts.length} // This is important for the library
      next={fetchMorePosts} // Function to load more items
      hasMore={hasMore} // Whether more data is available
      loader={<p className="text-center mt-4">Loading...</p>}
      endMessage={<p className="text-center mt-4">No more posts</p>}
    >
      <section className="space-y-4">
        {posts.map((postId) => (
          <SinglePost key={postId} />
        ))}
      </section>
    </InfiniteScroll>
  );
};

export default NewsFeed;
