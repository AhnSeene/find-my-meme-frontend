import {useState, useEffect} from 'react';
import axios from 'axios';

function Profile({userId}){
    const [profilePic,setProfilePic] = useState('');
    const [username, setUsername] = useState('');

    useEffect(()=>{
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`/api/user/{userId}`);
                setProfilePic(response.data.profile_img);
                setUsername(response.data.username);
            } catch(error){
                console.log('Error fetching user profile:', error);
            }
        };
        fetchUserProfile();
    }, [userId]);

    return(
        <div className="profile">
            <img src={profilePic} alt={`${username}.profilePic`}/>
            <div>{username}</div>
        </div>
    )
}
export default Profile;