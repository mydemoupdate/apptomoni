import oauth from '../oauth'

const resource = '/token';

export default {
    getPasswordToken(username, password){
        var bodyFormData = new FormData()
        bodyFormData.set('grant_type', 'password')
        bodyFormData.set('client_id', '2')
        bodyFormData.set('client_secret', 'o2OXuqqd1jWQGPFMHT9mrCVxiAE8n2PVqWQykvkL')
        bodyFormData.set('username', username)
        bodyFormData.set('password', password)
        bodyFormData.set('scope', '*')

        return oauth.post(`${resource}`, bodyFormData)
    },
    getRefreshToken(data){
        return oauth.post(`${resource}`, data)
    }
}
