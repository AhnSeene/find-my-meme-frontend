import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/useAuthStore";

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

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    //원래 요청 저장
    const originalRequest = error.config;
    //401에러 처리
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code;

      //이미 재시도했던 요청은 다시 재시도 하지 않음
      if (originalRequest._retry) {
        //로그아웃 처리
        triggerLogout();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      switch (errorCode) {
        case "AUTH_EXPIRED_ACCESS_TOKEN":
          //액세스 토큰 만료 -> 토큰 재발급 시도
          originalRequest._retry = true;
          try {
            const res = await api.post("/reissue");
            const newAccessToken = res.data.data.accessToken;
            useAuthStore
              .getState()
              .login(newAccessToken, useAuthStore.getState().username);
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (error) {
            toast.error(
              error.response?.data?.message ||
                "Refresh Token도 만료됨, 로그아웃 처리 필요"
            );
            triggerLogout();
            window.location.href = "/login";
            return Promise.reject(error);
          }
        case "AUTH_INVALID_CREDENTIALS":
          // 로그인 실패 -> 컴포넌트에서 처리할 수 있도록 에러 전달

          return Promise.reject(error);
        case "AUTH_EXPIRED_REFRESH_TOKEN":
        case "AUTH_INVALID_REFRESH_TOKEN":
          // 리프레시 토큰 문제 -> 로그아웃 처리
          toast.error(
            error.response?.data?.message || "세션이 만료되었습니다."
          );
          triggerLogout();
          window.location.href = "/login";
          return Promise.reject(error);

        default:
          // 다른 401 에러 (본문 없는 401 포함) -> 로그아웃 처리
          toast.error(
            error.response?.data?.message || "인증 오류가 발생했습니다."
          );
          triggerLogout();
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);

          return Promise.reject(error);
      }
    }

    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     const res = await api.post("/reissue");
    //     localStorage.setItem("jwtToken", res.data.data.accessToken);
    //     api.defaults.headers.common[
    //       "Authorization"
    //     ] = `Bearer ${res.data.data.accessToken}`;
    //     return api(originalRequest);
    //   } catch (err) {
    //     alert("Refresh Token도 만료됨, 로그아웃 처리 필요");
    //     triggerLogout();
    //     window.location.href = "/login";
    //     return Promise.reject(err);
    //   }
    // }

    // if (error.response?.status === 403) {
    //   alert("접근 권한이 없습니다.");
    // }

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
