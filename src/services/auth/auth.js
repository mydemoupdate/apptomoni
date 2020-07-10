import axios from 'axios'
// import token from "@/services/auth/token";

const baseDomain = 'http://139.180.207.4:81';
const baseUrl = `${baseDomain}/api`;

export default axios.create({
    'baseURL': baseUrl,
    // headers: {
    //     'Authorization': `Bearer ${token.getToken()}`
    // }
})
