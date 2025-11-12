import React from "react";

const Card: React.FC = ({ single }) => {
  console.log(single);
  return <div>{single.title}</div>;
};
export default Card;
