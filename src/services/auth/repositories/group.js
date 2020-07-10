import auth from '../auth'

const resource = '/roles';

export default {
    all(query){
        return auth.get(`${resource}?${query}`)
    },
    get(id, query){
        return auth.get(`${resource}/${id}?${query}`)
    },
    create(data){
        return auth.post(`${resource}`, data)
    },
    delete(id){
        return auth.delete(`${resource}/${id}`)
    },
}
