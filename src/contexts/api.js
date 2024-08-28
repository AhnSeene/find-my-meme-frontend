import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1/', // API의 기본 URL
});

// 요청 인터셉터 추가 - 모든 요청에 Authorization 헤더를 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken'); // AuthContext와 동일한 key 사용
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('config headers', config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
