import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/useAuthStore";

const apiUrl = process.env.REACT_APP_API_URL;

// 기본 axios 인스턴스 생성
const api = axios.create({
  baseURL: `${apiUrl}/v1/`,
  withCredentials: true,
});

// 요청 인터셉터: 토큰 자동 헤더 추가
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401처리 + 재발급
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { logout, login } = useAuthStore.getState();
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code;

      //이미 재시도 했으면 로그아웃
      if (originalRequest._retry) {
        logout();
        toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return Promise.reject(error);
      }

      switch (errorCode) {
        case "AUTH_EXPIRED_ACCESS_TOKEN":
          //액세스 토큰 만료 -> 토큰 재발급 시도
          originalRequest._retry = true;
          try {
            const res = await api.post("/reissue");
            const newToken = res.data.data.accessToken;
            login(newToken, useAuthStore.getState().username);
            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (error) {
            toast.error(
              error.response?.data?.message ||
                "Refresh Token도 만료되어 로그아웃 됩니다."
            );
            setTimeout(() => {
              window.location.href = "/login";
            }, 2000);
            return Promise.reject(error);
          }
        case "AUTH_INVALID_CREDENTIALS":
        case "AUTH_EXPIRED_REFRESH_TOKEN":
        case "AUTH_INVALID_REFRESH_TOKEN":
        default:
          logout();
          toast.error(
            error.response?.data?.message || "인증 오류가 발생했습니다."
          );
          // setTimeout(() => {
          //   window.location.href = "/login";
          // }, 2000);

          return Promise.reject(error);
      }
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

const apiService = {
  ...api,
  uploadProfileImage,
};

export default apiService;

export const useApi = () => {
  return apiService;
};
