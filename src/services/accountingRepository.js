import token from "./auth/token";
import axios from 'axios';

const baseDomain = 'http://139.180.207.4:82';
const baseUrl = `${baseDomain}/api`;

export default axios.create({
    'baseURL': baseUrl,
    headers: {
        'Authorization': `Bearer ${token.getToken()}`
    }
})

