import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import ProfileBadgeItem from "./ProfileBadgeItem";
import { getAcceptedBadges, getBadgesId, getBadgeObj, getPubKey, getAllRecievedBadges, getNewAcceptBadgesTags, sendNewEvent, arrayDiff, getWindowPubkey } from '../BadgeStrFunction';

const ProfileBadges = ({ id }) => {
    const [recievedBadges, setRecievedBadges] = useState([]);
    const [acceptedBadges, setAcceptedBadges] = useState([]);
    const [diffBadges, setDiffBadges] = useState([]);
    const [badgesData, setBadgesData] = useState([]);

    const init_LoadFinish = useRef(false)
    const init_recievedBadges = useRef(true)
    const init_acceptedBadges = useRef(true)
    const oldBadges = useRef([])
    const updatePush = useRef(false)
    // const badgesData = useRef([])

    useEffect(() => {
        if (init_recievedBadges.current) {
            init_recievedBadges.current = false

            const fetchRecievedBadges = async () => {
                const badge_tags = await getAllRecievedBadges(getPubKey(id))
                // console.log('badge_id...', getAcceptedBadgesId(badge_tags))
                setRecievedBadges(badge_tags)
            }
            fetchRecievedBadges()
        }

        if (init_acceptedBadges.current) {
            init_acceptedBadges.current = false

            const fetchAcceptedBadges = async () => {
                const badge_tags = await getAcceptedBadges(getPubKey(id))
                // console.log('badge_id...', getAcceptedBadgesId(badge_tags))
                setAcceptedBadges(badge_tags)
                init_LoadFinish.current = true
            }
            fetchAcceptedBadges()

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
    }, []);

    useEffect(() => {
        if (badgesData.length === 0) {
            const promises = getBadgesId(recievedBadges).map(async (b) => {
                // console.log('b', b)
                const obj = await getBadgeObj(b)
                return obj
            })

            Promise.all(promises).then((objData) => {
                // setBadgesData(objData)
                setBadgesData(objData)
            })
        }

    }, [recievedBadges]);

    useEffect(() => {
        const diff = arrayDiff(recievedBadges, acceptedBadges)
        // console.log('arrayDiff...', diff)
        setDiffBadges(diff)
    }, [acceptedBadges, recievedBadges]);

    const findDataObj = (id) => badgesData.filter(d => d.badge_id === id)

    const [showEditBtn, setShowEditBtn] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [containerClassName, setContainerClassName] = useState("badges-container");

    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (shouldLog.current) {
    //         shouldLog.current = false

    //         const fetchAcceptedBadgesData = async () => {
    //             const badge_tags = await getAcceptedBadges(getPubKey(id))
    //             // console.log('badge_id...', getAcceptedBadgesId(badge_tags))
    //             setBadges(badge_tags)
    //         }
    //         fetchAcceptedBadgesData()

    //         const login = (localStorage.getItem('login') === 'true')
    //         // console.log('login...', login)

    //         if (login) {
    //             const fetchDataProfile = async () => {
    //                 const myPub = await window.nostr.getPublicKey()
    //                 console.log(myPub)

    //                 setShowEditBtn(myPub === getPubKey(id))
    //             }
    //             fetchDataProfile()
    //         }
    //     }
    // }, [])

    // useEffect(() => {
    //     const promises = getBadgesId(badges).map(async (b) => {
    //         const obj = await getBadgeObj(b)
    //         return obj
    //     })

    //     Promise.all(promises).then((objData) => {
    //         setBadgesObj(objData)
    //     })
    //         .then(async () => {
    //             if (getBadgesId(badges).length > 0) {
    //                 const fetchDiffData = await getUnAcceptedBadges(getPubKey(id), getBadgesId(badges))
    //                 // console.log('fdd ...', fetchDiffData)
    //                 setDiff(fetchDiffData)
    //             }
    //         })
    // }, [badges]);

    // useEffect(() => {
    //     const promises_diff = getBadgesId(diff).map(async (b) => {
    //         const d = await getBadgeObj(b)
    //         return d
    //     })
    //     Promise.all(promises_diff).then((diffData) => {
    //         setDiffObj(diffData)
    //     })
    // }, [diff]);

    function handleEdit(type, index) {
        console.log('handleEdit...', type, ', index... ', index)
        // setBadges(badges.slice(index, 1))

        if (type) {
            console.log('remove')

            if (index > -1) {
                const a = [...acceptedBadges]
                a.splice(index, 1)
                // console.log(a)
                setAcceptedBadges(a)
            }
        }
        else {
            console.log('add')
            if (index > -1) {
                setAcceptedBadges([...acceptedBadges, diffBadges[index]]);
            }
            // setAcceptedBadges(acceptedBadges.push(diffBadges[index]))
        }
    }

    function handleToggleEdit() {
        // console.log(pubkey)
        // console.log(await window.nostr.getPublicKey())
        if (!editMode) {
            setContainerClassName("badges-container-edit");
            setEditMode(!editMode)

            oldBadges.current = acceptedBadges

            updatePush.current = false
        }
        else {
            setContainerClassName("badges-container");
            setEditMode(!editMode)

            if (!updatePush.current) {
                setAcceptedBadges([...oldBadges.current])
            }
        }
        handleEdit()
    }

    async function handleClickUpdate() {
        console.log('handleClickUpdate')

        // console.log(id)
        // console.log(await getWindowPubkey())

        if (id === await getWindowPubkey()) {
            const tags = getNewAcceptBadgesTags(acceptedBadges)
            console.log(tags)

            await sendNewEvent(30_008, '', tags)

            setEditMode(false)
            setContainerClassName("badges-container")

            updatePush.current = true

            // const newEmptyObj = {}
            oldBadges.current = acceptedBadges
        }
        else {

            window.location.reload()
        }

        // // const remains = getAcceptedBadgesId(badges).filter(x => !removeBadges.current.includes(x));
        // // console.log(remains)

        // const tags = getRemainTags(removeBadges.current, badges)
        // console.log(tags)

        // const e = await sendNewEvent(30_008, '', tags)
        // console.log(e)

        // const fetchBadgesData = async () => {
        //     const badge_tags = await getAcceptedBadges(getPubKey(id))
        //     // console.log('badge_id...', getAcceptedBadgesId(badge_tags))
        //     setBadges(badge_tags)
        // }
        // fetchBadgesData()
    }

    return (
        (init_LoadFinish.current)
            ? <div className="badges">
                <div className='badges-header'>
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
                                    <div>
                                        <button onClick={() => { handleClickUpdate() }}>Update</button>
                                    </div>
                                </div>
                                : <></>
                            }

                        </div>
                        : <></>}
                </div>
                {(acceptedBadges.length > 0)
                    ? (
                        <>

                            <h3>Accepted Badges</h3>
                            <div className={containerClassName}>
                                <div className="badges-list">
                                    {acceptedBadges.filter(f => (f.badge_id !== '')).map((b, i) => (
                                        <ProfileBadgeItem key={i} index={i} badgeItem={findDataObj(b[0])[0]} type={true} editMode={editMode} handleEdit={handleEdit} />
                                    ))}
                                </div>
                            </div>
                        </>
                    )
                    : (<></>)}
                {(diffBadges.length > 0)
                    ? (
                        <>
                            <h3>Unaccept Badges</h3>
                            <div className={containerClassName}>
                                <div className="badges-list">
                                    {diffBadges.filter(f => (f.badge_id !== '')).map((b, i) => (
                                        <ProfileBadgeItem key={i} index={i} badgeItem={findDataObj(b[0])[0]} type={false} editMode={editMode} handleEdit={handleEdit} />
                                    ))}
                                </div>
                            </div>
                        </>
                    )
                    : (<></>)}{/* */}
            </div>
            : <></>
    );
}

export default ProfileBadges