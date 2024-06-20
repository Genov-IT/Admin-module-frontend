import axios from 'axios';




const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    function(config) {
        const token = localStorage.getItem("U#T");
        if (token) {
             let refactorToken = token.replace(/^"|"$/g, '');
            config.headers.Authorization = `Bearer ${refactorToken}`;
        }
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

export default axiosInstance;
