import React, { useState, useEffect, useRef } from 'react';
import ProfileBadgeItem from "./ProfileBadgeItem";

const ProfileBadges = ({ pubkey, badgesObj, diffObj }) => {
    const [showEditBtn, setShowEditBtn] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [containerClassName, setContainerClassName] = useState("badges-container");
    // const [removeBadges, setRemoveBadges] = useState([])

    const shouldLog = useRef(true)

    useEffect(() => {
        if (shouldLog.current) {
            const login = (localStorage.getItem('login') === 'true')
            // console.log('login...', login)
            shouldLog.current = false

            if (login) {
                const fetchDataProfile = async () => {
                    const myPub = await window.nostr.getPublicKey()
                    console.log(myPub)

                    setShowEditBtn(myPub === pubkey)
                }
                fetchDataProfile()
            }
        }
    }, [])

    function handleClick() {
        // console.log(pubkey)
        // console.log(await window.nostr.getPublicKey())
        if (!editMode) {
            setContainerClassName("badges-container-edit");
            setEditMode(!editMode)
        }
        else {
            setContainerClassName("badges-container");
            setEditMode(!editMode)
        }
    }

    const removeBadges = useRef([])

    return (
        <div className="badges">
            {(badgesObj.length > 0)
                ? (
                    <>
                        <h3>Accepted Badges</h3>

                        {(showEditBtn)
                            ?
                            <label className='switch'>
                                <input type="checkbox" checked={editMode} onChange={handleClick} />
                                <span className='slider round'></span>
                            </label>
                            : <></>}
                        <div className={containerClassName}>
                            <div className="badges-list">
                                {badgesObj.filter(f => (f.badge_id !== '')).map((b, i) => (
                                    <ProfileBadgeItem key={i} badgeItem={b} type={true} editMode={editMode} removeBadges={removeBadges} />
                                ))}
                            </div>
                        </div>
                    </>
                )
                : (<></>)}
            {(diffObj.length > 0)
                ? (
                    <>
                        <h3>Unaccept Badges</h3>
                        <div className="badges-container">
                            <div className="badges-list">
                                {diffObj.filter(f => (f.badge_id !== '')).map((b, i) => (
                                    <ProfileBadgeItem key={i} badgeItem={b} type={false} />
                                ))}
                            </div>
                        </div>
                    </>
                )
                : (<></>)}
        </div>
    );
}

export default ProfileBadges