import axios from 'axios';

const API_URL = '/api/titles';

export const getAll = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

export const create = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const update = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const remove = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export default {
  getAll,
  getById,
  create,
  update,
  remove
};