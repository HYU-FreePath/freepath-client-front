import axios from 'axios'

export const apiClient = axios.create({
    baseURL: 'https://port-0-barrier-free-map-server-mbdezq0l7f20ef60.sel4.cloudtype.app/api/',
    timeout: 10000,
})
