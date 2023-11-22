import React from 'react';
import { useParams } from "react-router-dom";
import ProfileMetaData from './ProfileMetaData';
import ProfileBadges from './ProfileBadges';
import './Profile.css';

function Profile() {
    let { id } = useParams();

    return (
        <div className='main'>
            <ProfileMetaData id={id} />
            <ProfileBadges id={id} />
        </div>

    )
}


export default Profile