import axios from "axios";

const backendApi = axios.create({
  //baseURL: "https://my-first-mern-task-manager.onrender.com/api", // http://localhost:5001/api for deployment
  baseURL: "http://localhost:5000/api",
});

export default backendApi;
