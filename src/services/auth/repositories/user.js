import auth from '../auth'

const resource = '/users';

export default {
    all(query){
        return auth.get(`${resource}?${query}`)
    },
    get(id, query){
        return auth.get(`${resource}/${id}?${query}`)
    },
    create(data){
        return auth.post(`${resource}?${data}`)
    },
    update(data, id){
        return auth.put(`${resource}/${id}`, data)
    },
    delete(id){
        return auth.delete(`${resource}/${id}`)
    },
    me(query){
        return auth.get("me?"+query);
    },
    registers(data){
        return auth.post(`register`, data);
    }
}
