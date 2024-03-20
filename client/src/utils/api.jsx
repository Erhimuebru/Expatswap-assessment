import axios from "axios";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

export const apiGet = async (path) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("signature")}`,
    },
  };
  const result = await axios.get(`${baseUrl}${path}`, config);
  return result;
};

export const apiPost = async (path, body = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("signature")}`,
    },
  };
  return await axios.post(`${baseUrl}${path}`, body, config);
};

export const apiUpdate = async (path, body) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("signature")}`,
    },
    
  };
  return await axios.patch(`${baseUrl}${path}`, body, config);
};

export const apiPut = async (path, body = {}, auth = true) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("signature")}`,
    },
  };
  return await axios.put(`${baseUrl}${path}`, body, config);
};

export const apiPutFormData = async (path, body = {}, auth = true) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("signature")}`,
      "Content-Type": "multipart/form-data",
    },
  };
  return await axios.put(`${baseUrl}${path}`, body, config);
};

export const apiDelete = async (path, auth = true) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("signature")}`,
    },
  };
  return await axios.delete(`${baseUrl}${path}`, config);
};
