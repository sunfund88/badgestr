import React, { useState, useEffect, useRef } from 'react';
import { getPubKey, getProfile, getUserName } from '../BadgeStrFunction';

const ProfileMetaData = ({ id }) => {
    const [profile, setProfile] = useState(null);
    const shouldLog = useRef(true)

    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false
            const fetchDataProfile = async () => {
                const pf = await getProfile(getPubKey(id))
                setProfile(pf)
            }
            fetchDataProfile()
        }
    }, [])

    return (
        (profile !== null)
            ? <>
                <div className="header">
                    <div className="header-banner">
                        <img src={profile?.banner}
                            width="800"
                            height="266"
                            alt={profile?.name}
                        // onLoadStart={() => setIsLoading(true)}
                        // onLoad={() => setIsLoading(false)}>
                        />
                    </div>
                    <div className="header-picture">
                        <img src={profile?.picture} alt={getUserName(profile)}></img>
                    </div>
                    <div className="header-name">
                        <h1>{getUserName(profile)}</h1>
                        <h4>{profile?.npub}</h4>
                    </div>

                </div>
                <div className="header-address">
                    <ul>
                        <li>🟣 {profile?.nip05}</li>
                        <li>⚡ {profile?.lud16}</li>
                    </ul>
                </div>
                <div className="header-about">
                    {profile?.about}
                </div>
            </>
            : <></>
    );
}

export default ProfileMetaData