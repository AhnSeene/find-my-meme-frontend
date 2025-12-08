import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import useNotificationStore from "../store/useNotificationStore";

const useSSE = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const accessToken = useAuthStore((state) => state.token);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );
  useEffect(() => {
    if (!isLoggedIn || !accessToken) {
      console.log(" 로그인 안됨 — SSE 연결 안 함");
      return;
    }

    console.log(" SSE 연결 시도 중:", accessToken);
    // SSE 연결 설정
    const eventSource = new EventSource(
      `http://localhost:8080/api/v1/sse/notifications?token=${accessToken}`
    );

    eventSource.onopen = () => {
      console.log(" SSE 연결 성공");
    };

    eventSource.onerror = (error) => {
      console.error(" SSE 에러 발생:", error);
    };

    eventSource.addEventListener("notification", (event) => {
      const data = JSON.parse(event.data);
      console.log(" 새 알림 수신:", data);
      addNotification(data);
    });

    return () => {
      console.log(" SSE 연결 종료");
      eventSource.close();
    };
  }, [isLoggedIn, accessToken]);
};

export default useSSE;
