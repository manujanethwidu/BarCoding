import axios from 'axios'

export default axios.create({
  //baseURL: "http://localhost:5433" //<== no backslashe here
   baseURL:"http://192.168.1.150:5433" //<== no back    slashe here
})
