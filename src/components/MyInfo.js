import { useState, useEffect } from "react";
import api from "../contexts/api";

function MyInfo() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await api.get(`/users/me`);
                if (response.data.success) {
                    setUsername(response.data.data.username);
                    setEmail(response.data.data.email);
                } else {
                    throw new Error('Failed to fetch user info');
                }
            } catch (error) {
                console.log('MyInfo 데이터 불러오기 실패', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="myinfo">
            <h1>My Information</h1>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Email:</strong> {email}</p>
        </div>
    );
}

export default MyInfo;
