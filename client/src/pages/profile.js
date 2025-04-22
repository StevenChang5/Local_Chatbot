import {useEffect, useState} from 'react';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem('token');

        if(!token){
            window.location.href ='/';
            return;
        }

        fetch('http://localhost:8080/profile/main_profile',{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(() => {
            localStorage.removeItem('token');
            window.location.href = '/';
        })
    }, []);

    if(!profile) return <p>Loading profile</p>;

    return (
        <div>
            <h1>Welcome {profile.id} to your profile!</h1>
        </div>
    );
};

export default Profile;