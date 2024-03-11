import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '22826831-5d908bee0ebd1f4df6d211081';

export default async function fetchArticles(query, page) {
  const options = {
    params: {
      key: KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
    },
  };

  try {
    const response = await axios.get(`${BASE_URL}`, options);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
