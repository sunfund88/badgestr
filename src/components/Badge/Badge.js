import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { nip19 } from "nostr-tools";
import './Badge.css'
import { getProfile, getReadRelays, convertTime, getUsersRecievedBadge, getUserName, fetchBadgeInfoById } from '../BadgeStrFunction';
import BadgeUserItem from './BadgeUserItem';

function Badge() {
    let { id } = useParams();

    const [badgeData, setBadgeData] = useState(undefined);
    const [ownerData, setOwnrData] = useState(undefined);
    const [recieve, setRecieve] = useState(undefined);

    // const badge_data = useRef({})
    const shouldLog = useRef(true)

    const navigate = useNavigate();

    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false
            const badge_obj = nip19.decode(id)
            const badge_id = badge_obj.data.kind + ':' + badge_obj.data.pubkey + ':' + badge_obj.data.identifier
            console.log(badge_obj)

            const fetchData = async () => {
                const badge_data = await fetchBadgeInfoById(badge_id)

                setBadgeData(badge_data)

            }
            fetchData()

            const fetchOwner = async () => {
                const owner = await getProfile(badge_obj.data.pubkey)
                setOwnrData(owner)
            }
            fetchOwner()

            const fetchRecieve = async () => {
                const r = await getUsersRecievedBadge(badge_id)

                console.log(r)
                setRecieve(r)
            }
            fetchRecieve()
        }
    }, [])


    function pushBack() {
        // Prevent the back button from working
        window.history.back()
    }

    function clickedPubkey(pubkey) {
        const url = '/p/' + pubkey

        navigate(url)
    }

    return (
        <div className='main'>
            <div className='b-badge-container'>
                {(badgeData !== undefined)
                    ? <>
                        <div>
                            <button className='back_btn' onClick={() => { pushBack() }}> Back </button>
                        </div>
                        <div className='b-badge'>
                            <div className='b-badge-profile'>
                                <img
                                    src={badgeData.image}
                                    title={badgeData.name}
                                    alt={badgeData.name}
                                    onError={event => {
                                        event.target.src = "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png"
                                        event.onerror = null
                                    }} />
                            </div>
                            <div className='b-badge-info'>
                                <div className='b-badge-name'>{badgeData?.name}</div>
                                <div className='b-badge-description'>{badgeData?.description}</div>
                                <div className='b-badge-owner gap'>
                                    <label>Created at:</label>

                                    <div className='b-badge-owner-span'>
                                        <div className='b-badge-owner-txt'>{convertTime(badgeData?.created_at)}</div>
                                    </div>
                                    <div className='b-badge-owner-span-name' onClick={() => clickedPubkey(badgeData?.owner)}>
                                        <img
                                            src={ownerData?.picture}
                                            alt={ownerData?.display_name}
                                        />
                                        <div className='b-badge-owner-txt'>{getUserName(ownerData)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    : <></>}

                {(recieve !== undefined)
                    ? <div className='b-badge-recieved-header'>
                        <h4>Awarded {recieve.length} User(s):</h4>
                        <div className='b-badge-recieved-container'>
                            <div className='b-badge-recieved'>
                                {recieve.map((r, i) =>
                                    (r !== undefined)
                                        ?
                                        <BadgeUserItem key={i} user={r} />
                                        : <></>
                                )}
                            </div>
                        </div>
                        {/* {(recieve.length > 70)
                            ? <></>
                            : <></>} */}
                    </div>
                    : <></>}
            </div>
        </div>
    )
}


export default Badge