import axios from 'axios'
import { store }  from "redux/store";

// // Create axios instance
const AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASENAME,
});

// // Add a request interceptor
AxiosInstance.interceptors.request.use(
  config => {
  const { accessToken } = store.getState().auth;
    if (accessToken) {
      config.headers['Authorization'] = 'Bearer ' + accessToken;
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// // Add a response interceptor
// // axios.interceptors.response.use(
// //   response => {
// //     return response
// //   },
// //   function (error) {
// //     const originalRequest = error.config

// //     if (
// //       error.response.status === 401 &&
// //       originalRequest.url === 'http://127.0.0.1:3000/v1/auth/token'
// //     ) {
// //       router.push('/login')
// //       return Promise.reject(error)
// //     }

// //     if (error.response.status === 401 && !originalRequest._retry) {
// //       originalRequest._retry = true
// //       const refreshToken = localStorageService.getRefreshToken()
// //       return axios
// //         .post('/auth/token', {
// //           refresh_token: refreshToken
// //         })
// //         .then(res => {
// //           if (res.status === 201) {
// //             localStorageService.setToken(res.data)
// //             axios.defaults.headers.common['Authorization'] =
// //               'Bearer ' + localStorageService.getAccessToken()
// //             return axios(originalRequest)
// //           }
// //         })
// //     }
// //     return Promise.reject(error)
// //   }
// // )

// export default axiosInstance



// const AxiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_BASENAME,
// });

// AxiosInstance.interceptors.request.use(function (config) {
//   // Do something before request is sent
//   // let token = JSON.parse(localStorage.getItem("accessToken"));

//   const { accessToken } = store.getState().auth;
//   console.log(accessToken)
//   config.headers["Authorization"] = "Bearer " + accessToken;
//   return config;
// });

export default AxiosInstance;