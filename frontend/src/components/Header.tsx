import { useState } from "react";

const Header: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  return <h1>Header</h1>;
};

export default Header;
