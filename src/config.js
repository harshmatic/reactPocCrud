export let api =''

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    api = 'http://192.168.101.162:6060/api'

} else {
    api = '/api'
}