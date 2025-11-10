import { useState } from "react";

const Home: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  return <h1>Home</h1>;
};

export default Home;
