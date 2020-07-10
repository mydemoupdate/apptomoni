import api from './auth/auth';
const resource='/permissions';

export default {
    all(query){
        return api.get(`${resource}?${query}`);
    },
    get(id, query){
        return api.get(`${resource}/${id}?${query}`);
    },
    create(data){
        return api.post(`${resource}`, data);
    },
    delete(id){
        return api.delete(`${resource}/${id}`);
    },
    update(data, id){
        return api.put(`${resource}/${id}`, data);
    },
}
