import api from './orderRepository'
const resource = '/orders';
export default {
    all(query){
        return api.get(`${resource}?${query}`);
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
    update(data, id){
        return api.put(`${resource}/${id}`, data)
    },
    createTracking(data){
        return api.post(`${resource}`+'/tracking', data);
    },
    createTrackItem(data){
        return api.post(`${resource}`+'/tracking-items', data)
    },
    deleteTrack(id){
        return api.delete(`${resource}`+'/tracking/'+id);
    },
    getTracking(id){
        return api.get(`${resource}`+'/tracking/'+id)
    },
    updateOrderItem(data, id){
        return api.put(`${resource}`+'/items/'+id, data)
    },
    updateOrderItemProduct(data){
        return api.post(`${resource}`+'/items', data)
    },
    getStatus(id){
        return api.get(`${resource}`+'/statuses/'+id)
    },
    updateState(id,data){
        return api.put(`${resource}`+'/'+id, data)
    }
}
