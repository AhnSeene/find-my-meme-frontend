import { useState, useEffect, useRef } from "react";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import useNotificationStore from "../../store/useNotificationStore";
import "./notificationbell.css";

function NotificationBell() {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const clearAll = useNotificationStore((state) => state.clearAll);

  const [showDropdown, setShowDropdown] = useState(false); // ⭐ 드롭다운 열림/닫힘 상태
  const [displayedToasts, setDisplayedToasts] = useState(new Set());
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleBellClick = () => {
    setShowDropdown(!showDropdown); // ⭐ 클릭하면 토글
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
    // 여기서 알림 관련 페이지로 이동하거나 액션 수행
  };

  const handleClearAll = () => {
    if (window.confirm("모든 알림을 삭제하시겠습니까?")) {
      clearAll();
    }
  };

  // 시간 포맷팅
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "방금 전";
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;

    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  // 새로운 알림만 토스트로 표시
  const newNotifications = notifications.filter(
    (n) => !displayedToasts.has(n.id)
  );

  return (
    <>
      {/* Navbar의 벨 아이콘 */}
      <div className="notification-bell" ref={dropdownRef}>
        <button
          className="notification-button"
          onClick={handleBellClick}
          aria-label="알림"
        >
          {unreadCount > 0 ? (
            <IoNotifications className="bell-icon active" />
          ) : (
            <IoNotificationsOutline className="bell-icon" />
          )}
          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* ⭐ 드롭다운 알림 목록 */}
        {showDropdown && (
          <div className="notification-dropdown">
            <div className="notification-header">
              <h3>알림</h3>
              {notifications.length > 0 && (
                <button className="clear-all-btn" onClick={handleClearAll}>
                  모두 삭제
                </button>
              )}
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-empty">
                  <div className="empty-icon">🔔</div>
                  <p>새로운 알림이 없습니다</p>
                </div>
              ) : (
                <ul>
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`notification-item ${
                        !notification.isRead ? "unread" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="notification-content">
                        <p className="notification-message">
                          {notification.message}
                        </p>
                        <span className="notification-time">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      {!notification.isRead && (
                        <span className="unread-dot"></span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 화면에 뜨는 토스트 알림들 (새 알림만) */}
      <div className="notification-toast-container">
        {newNotifications.slice(-3).map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={(id) => {
              setDisplayedToasts((prev) => new Set([...prev, id]));
            }}
          />
        ))}
      </div>
    </>
  );
}

// 개별 토스트 알림 컴포넌트
function NotificationToast({ notification, onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 5초 후 자동으로 사라짐
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300);
  };

  return (
    <div
      className={`notification-toast ${isExiting ? "exiting" : ""}`}
      onClick={handleDismiss}
    >
      <div className="toast-icon">
        <IoNotifications />
      </div>
      <div className="toast-content">
        <p className="toast-message">{notification.message}</p>
      </div>
      <button
        className="toast-close"
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
      >
        ×
      </button>
    </div>
  );
}

export default NotificationBell;
