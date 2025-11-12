import React from "react";

import Card from "./Card";
import { useLoaderData } from "react-router";

const Home: React.FC = () => {
  //const app = useLoaderData();
  const app = useLoaderData();
  console.log(app);

  console.log(app);

  return (
    <div>
      {app.map((single, index) => (
        <Card key={index} single={single} />
      ))}
    </div>
  );
};

export default Home;
