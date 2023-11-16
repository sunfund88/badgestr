import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { nip19 } from "nostr-tools";
import './Badge.css'
import { getProfile, getReadRelays, convertTime, getUsersRecievedBadge, getUserName } from '../BadgeStrFunction';
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
                const badge_data = await getBadgeInfo(badge_id)

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


    async function getBadgeInfo(badgeId) {
        const bid = badgeId
        badgeId = badgeId.split(':')
        let events = await window.pool.list(getReadRelays(), [{
            kinds: [30_009],
            authors: [badgeId[1]],
            '#d': [badgeId[2]]
        }])
        //console.log(badgeId[2])

        let badgeInfo = {
            'badge_id': '',
            'd': '',
            'owner': '',
            'created_at': '',
            'name': '',
            'description': '',
            'image': '',
            'thumb': ''
        }
        //console.log(events)

        if (events.length > 0) {
            events.sort((a, b) => b.created_at - a.created_at)

            let tags = events[0].tags

            //console.log(tags)

            badgeInfo = {
                'badge_id': bid,
                'd': badgeId[2],
                'owner': badgeId[1],
                'created_at': events[0].created_at,
                'name': tags.filter(t => t[0] === 'name').map(t => t[1])[0],
                'description': tags.filter(t => t[0] === 'description').map(t => t[1])[0],
                'image': tags.filter(t => t[0] === 'image').map(t => t[1])[0],
                'thumb': tags.filter(t => t[0] === 'thumb').map(t => t[1])[0]
            }

            // console.log(badgeInfo)
            // return tags

        }
        return badgeInfo
    }

    function pushBack() {
        // Prevent the back button from working
        window.history.back()
    }

    function clickedPubkey(pubkey) {
        const url = '/p/' + pubkey

        navigate(url)
    }

    return (
        <div>
            {/* <h1>BADGE</h1> */}
            {/* <h2>{id}</h2> */}
            <div>
                {(badgeData !== undefined)
                    ? <>
                        <div>
                            <button className='back_btn' onClick={() => { pushBack() }}> Back </button>
                        </div>
                        <div className='b_badge'>
                            <img
                                src={badgeData.image}
                                title={badgeData.name}
                                alt={badgeData.name}
                                onError={event => {
                                    event.target.src = "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png"
                                    event.onerror = null
                                }} />
                            <div className='b_badge_info'>
                                <div className='b_badge_name'>{badgeData?.name}</div>
                                <div className='b_badge_description'>{badgeData?.description}</div>
                                <div className='b_badge_owner'>
                                    Created at:
                                    <div className='b_badge_owner_span'>
                                        <div className='b_badge_owner_txt'>{convertTime(badgeData?.created_at)}</div>
                                    </div>
                                    <div className='b_badge_owner_span_name' onClick={() => clickedPubkey(badgeData?.owner)}>
                                        <img
                                            src={ownerData?.picture}
                                            alt={ownerData?.display_name}
                                        />
                                        <div className='b_badge_owner_txt'>{getUserName(ownerData)}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                    : <></>}

                {(recieve !== undefined)
                    ? <>
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
                    </>
                    : <></>}
            </div>
        </div>
    )
}


export default Badge