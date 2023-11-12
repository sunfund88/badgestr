import React, { useState, useEffect, useRef } from 'react';
import ProfileBadgeItem from "./ProfileBadgeItem";
import { getRemainTags } from '../BadgeStrFunction';

const ProfileBadges = ({ pubkey, badges, badgesObj, diffObj }) => {
    const [showEditBtn, setShowEditBtn] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [removeLength, setRemoveLength] = useState(0);
    const [containerClassName, setContainerClassName] = useState("badges-container");
    // const [removeBadges, setRemoveBadges] = useState([])

    const shouldLog = useRef(true)
    const removeBadges = useRef([])

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

    function handleRemoveLength() {
        setRemoveLength(removeBadges.current.length)
    }

    function handleToggleEdit() {
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
        handleRemoveLength()
    }

    async function handleClickUpdate() {
        console.log('handleClickUpdate')

        const remains = badges.filter(x => !removeBadges.current.includes(x));
        console.log(remains)

        const tags = await getRemainTags()
        console.log(tags)

    }

    return (
        <div className="badges">
            {(badgesObj.length > 0)
                ? (
                    <>
                        <h3>Accepted Badges</h3>

                        {(showEditBtn)
                            ?
                            <div className='badges-edit-header'>
                                <div>
                                    Edit Mode:
                                    <label className='switch'>
                                        <input type="checkbox" checked={editMode} onChange={handleToggleEdit} />
                                        <span className='slider round'></span>
                                    </label>
                                </div>
                                {(editMode)
                                    ? <div>
                                        <div>Remove {removeLength} Item(s) </div>
                                        <button onClick={() => { handleClickUpdate() }}>handleClickUpdate</button>
                                    </div>
                                    : <></>
                                }

                            </div>
                            : <></>}
                        <div className={containerClassName}>
                            <div className="badges-list">
                                {badgesObj.filter(f => (f.badge_id !== '')).map((b, i) => (
                                    <ProfileBadgeItem key={i} badgeItem={b} type={true} editMode={editMode} removeBadges={removeBadges} handleRemoveLength={handleRemoveLength} />
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