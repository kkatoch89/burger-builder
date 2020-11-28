import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-my-burger-e5e5e.firebaseio.com/',
});

export default instance;
