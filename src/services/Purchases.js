import api from './orderRepository'

const resource = '/purchases';
export default {
    all(query){
        return api.get(`${resource}?${query}`)
    },
    get(id, query){
        return api.get(`${resource}/${id}?${query}`)
    },
    create(data){
        return api.post(`${resource}`, data)
    },
    delete(id){
        return api.delete(`${resource}/${id}`)
    },
    updateItem(data, id){
        return api.put(`${resource}`+'/items/'+id, data)
    }
}
