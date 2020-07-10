import axios from 'axios'

// const baseDomain = 'http://tomoniglobal.org/public';
const baseDomain = 'http://139.180.207.4:81';
const baseUrl = `${baseDomain}/oauth`;

export default axios.create({
    'baseURL': baseUrl
})
