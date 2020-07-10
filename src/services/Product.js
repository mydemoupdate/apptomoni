import product from './productRepository'

const resource = '/products';
let config = {
    header : {
        'Content-Type' : 'multipart/form-data'
    }
}
export default {
    all(query){
        return product.get(`${resource}?${query}`)
    },
    get(id, query){
        return product.get(`${resource}/${id}?${query}`)
    },
    create(data){
        return product.post(`${resource}`, data)
    },
    delete(id){
        return product.delete(`${resource}/${id}`)
    },
    update(data, id){
        return product.put(`${resource}/${id}`, data,config)
    },
    product_ingredients(data){
        return product.post(`product-ingredients`, data);
    }
}
