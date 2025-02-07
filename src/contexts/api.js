import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

// 이벤트 기반 로그아웃 처리
export const AUTH_EVENTS = {
  LOGOUT_REQUIRED: "AUTH_LOGOUT_REQUIRED",
};

const triggerLogout = () => {
  window.dispatchEvent(new Event(AUTH_EVENTS.LOGOUT_REQUIRED));
};
export { triggerLogout };

// 기본 axios 인스턴스 생성
const api = axios.create({
  baseURL: `${apiUrl}/v1/`,
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await api.post("/reissue");
        localStorage.setItem("jwtToken", res.data.data.accessToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        alert("Refresh Token도 만료됨, 로그아웃 처리 필요");
        triggerLogout();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    if (error.response?.status === 403) {
      alert("접근 권한이 없습니다.");
    }

    return Promise.reject(error);
  }
);

const uploadProfileImage = async (formData) => {
  try {
    const response = await api.post("/users/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("파일 업로드 실패:", error);
    throw error;
  }
};

// 기본 export를 유지
const apiService = {
  ...api,
  uploadProfileImage,
};

export default apiService;

// Hook도 함께 제공 (필요한 경우 사용)
export const useApi = () => {
  return apiService;
};
