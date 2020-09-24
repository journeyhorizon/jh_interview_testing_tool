import axios from "axios";

function myApi() {
  const instance = axios.create({
    baseURL: "http://localhost:3001/v1/api"
  });

  return {
    get: function (url, config) {
      return instance.get(url, config);
    },

    post: function (url, data) {
      return instance.post(url, data);
    },
  };
}

export default myApi;