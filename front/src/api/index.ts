import axios from 'axios'

const BASE_URL = 'http://localhost:8000/api/'

export const API = axios.create( {
  baseURL: BASE_URL,
  withCredentials: true,
} )

API.defaults.headers.common[ 'Content-Type' ] = 'application/json'
