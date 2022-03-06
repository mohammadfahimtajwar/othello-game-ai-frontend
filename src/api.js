import axios from "axios";
import { getUserColor } from "./calculate";

const BASE_API = process.env.REACT_APP_API;

export const getPoint = (type, data) => {
  console.log(`Getting point for ${getUserColor(data.player)} ${type}`);
  return axios
    .post(`${BASE_API}/${type}`, data)
    .then((res) => res.data)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.error("Error when getting point for", type, data);
      throw error;
    });
};
