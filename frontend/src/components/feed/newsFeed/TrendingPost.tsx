import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TrendingCard from "./TrendingCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TrendingPostProps {
  trendingPosts: any[];
}

// Custom Arrow Components
const NextArrow = ({ onClick }: any) => (
  <div
    className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-20 cursor-pointer p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
    onClick={onClick}
  >
    <ChevronRight size={24} />
  </div>
);

const PrevArrow = ({ onClick }: any) => (
  <div
    className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-20 cursor-pointer p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
    onClick={onClick}
  >
    <ChevronLeft size={24} />
  </div>
);

const TrendingPost: React.FC<TrendingPostProps> = ({ trendingPosts }) => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: trendingPosts.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 1 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const handleClick = (postId: string) => {
    navigate(`/feed/postDetails/${postId}`);
  };

  return (
    <div className="mb-6 relative">
      <h2 className="text-2xl font-bold mb-4 text-center">Trending Posts</h2>
      <div className="flex items-center justify-between text-gray-600 text-sm border-t border-gray-200 pt-2"></div>
      <Slider {...settings}>
        {trendingPosts.map((post) => (
          <div key={post._id} className="px-2">
            <div
              className="cursor-pointer"
              onClick={() => handleClick(post._id)}
            >
              <TrendingCard post={post} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TrendingPost;
