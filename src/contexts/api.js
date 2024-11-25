import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;
// Axios 인스턴스 생성
const api = axios.create({
  baseURL: `${apiUrl}/v1/`, // API의 기본 URL
});

// 요청 인터셉터 추가 - 모든 요청에 Authorization 헤더를 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken"); // AuthContext와 동일한 key 사용
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const uploadProfileImage = async (formData) => {
  try {
    const response = await api.post("/users/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // 파일 전송을 위한 Content-Type
      },
    });
    return response.data; // 서버로부터의 응답을 반환
  } catch (error) {
    console.error("파일 업로드 실패:", error);
    throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있게 함
  }
};

// axios 인스턴스와 uploadProfileImage 함수를 하나의 객체로 내보냄
export default {
  uploadProfileImage,
  ...api, // // 기존 axios 인스턴스의 메서드들 (get, post 등)
};
