import axios from 'axios';

const API_URL = '/api/search';

export const search = async (query) => {
  const response = await axios.get(`${API_URL}/${query}`);
  return response.data;
};

export const getByImdbID = async (imdbID) => {
  const response = await axios.get(`${API_URL}/byid/${imdbID}`);
  return response.data;
}

export default {
    search,
    getByImdbID
}