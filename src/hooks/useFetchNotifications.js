import { useEffect } from "react";
import api from "../contexts/api";
import useNotificationStore from "../store/useNotificationStore";

const useFetchNotifications = () => {
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data.data);
      } catch (err) {
        console.error("🔴 알림 목록 불러오기 실패:", err);
      }
    };

    fetchNotifications();
  }, []);
};

export default useFetchNotifications;
