import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import ProfileBadgeItem from "./ProfileBadgeItem";
import { getAcceptedBadges, getBadgesId, getBadgeObj, getPubKey, getRemainTags, getUnAcceptedBadges, sendNewEvent } from '../BadgeStrFunction';

const ProfileBadges = ({ id }) => {
    const [badges, setBadges] = useState([]);
    const [badgesObj, setBadgesObj] = useState([]);
    const [diff, setDiff] = useState([]);
    const [diffObj, setDiffObj] = useState([]);

    const [showEditBtn, setShowEditBtn] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [removeLength, setRemoveLength] = useState(0);
    const [containerClassName, setContainerClassName] = useState("badges-container");
    // const [removeBadges, setRemoveBadges] = useState([])

    const shouldLog = useRef(true)
    const removeBadges = useRef([])

    const navigate = useNavigate();

    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false

            const fetchBadgesData = async () => {
                const badge_tags = await getAcceptedBadges(getPubKey(id))
                // console.log('badge_id...', getAcceptedBadgesId(badge_tags))
                setBadges(badge_tags)
            }
            fetchBadgesData()

            const login = (localStorage.getItem('login') === 'true')
            // console.log('login...', login)

            if (login) {
                const fetchDataProfile = async () => {
                    const myPub = await window.nostr.getPublicKey()
                    console.log(myPub)

                    setShowEditBtn(myPub === getPubKey(id))
                }
                fetchDataProfile()
            }
        }
    }, [])

    useEffect(() => {
        const promises = getBadgesId(badges).map(async (b) => {
            const obj = await getBadgeObj(b)
            return obj
        })

        Promise.all(promises).then((objData) => {
            setBadgesObj(objData)
        })
            .then(async () => {
                if (getBadgesId(badges).length > 0) {
                    const fetchDiffData = await getUnAcceptedBadges(getPubKey(id), getBadgesId(badges))
                    // console.log('fdd ...', fetchDiffData)
                    setDiff(fetchDiffData)
                }
            })
    }, [badges]);


    useEffect(() => {
        const promises_diff = getBadgesId(diff).map(async (b) => {
            const d = await getBadgeObj(b)
            return d
        })
        Promise.all(promises_diff).then((diffData) => {
            setDiffObj(diffData)
        })
    }, [diff]);

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

        // const remains = getAcceptedBadgesId(badges).filter(x => !removeBadges.current.includes(x));
        // console.log(remains)

        const tags = getRemainTags(removeBadges.current, badges)
        console.log(tags)

        const e = await sendNewEvent(30_008, '', tags)
        console.log(e)

        // const url = '/p/' + id
        // console.log(url)

        // navigate(url)

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
                                <div className='badges-edit-toggle'>
                                    <h4>Edit Mode:</h4>
                                    <div>
                                        <label className='switch'>
                                            <input type="checkbox" checked={editMode} onChange={handleToggleEdit} />
                                            <span className='slider round'></span>
                                        </label>
                                    </div>
                                </div>
                                {(editMode)
                                    ? <div className='badges-edit-update'>
                                        <h4>Remove {removeLength} Item(s) </h4>
                                        <div>
                                            <button onClick={() => { handleClickUpdate() }}>Update</button>
                                        </div>
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