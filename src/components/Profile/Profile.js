import React, { useState, useEffect, useRef } from 'react';
import { nip19 } from 'nostr-tools';
import { useParams } from "react-router-dom";
import ProfileMetaData from './ProfileMetaData';
import ProfileBadges from './ProfileBadges';
import './Profile.css'


function Profile() {
    const [relays, setRelays] = useState(window.relays);
    const [profile, setProfile] = useState({});
    const [badges, setBadges] = useState([]);
    const [badgesObj, setBadgesObj] = useState([]);
    const [diff, setDiff] = useState([]);
    const [diffObj, setDiffObj] = useState([]);

    let { id } = useParams();
    const pubKeyRef = useRef(getPubKey(id))
    const shouldLog = useRef(true)

    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false
            const fetchDataProfile = async () => {
                const pf = await getProfile()
                await getAcceptedBadges()
                // await getUnAcceptedBadges()

                // console.log(pf)
                setProfile(pf)
            }
            fetchDataProfile()
        }
    }, [])

    useEffect(() => {
        const promises = badges.map(async (b) => {
            const info = await getBadgeInfo(b)
            return info
        })

        // fetchDiffData()

        Promise.all(promises).then((updateData) => {
            setBadgesObj(updateData)
            // console.log('setBadgesObj')
            // setDiff(fetchDiffData)
        })
            .then(async () => {
                if (badges.length > 0) {
                    const fetchDiffData = await getUnAcceptedBadges()
                    // console.log('fdd ...', fetchDiffData)
                    setDiff(fetchDiffData)
                }
            })




        // const fetchDiffData = async () => {

        //     const dd = await getUnAcceptedBadges()
        // }

        // Promise.all(fetchDiffData).then((fdiffData) => {
        //     setDiff(fdiffData)
        // })
    }, [badges]);

    useEffect(() => {
        const promises_diff = diff.map(async (b) => {
            const d = await getBadgeInfo(b)
            return d
        })
        Promise.all(promises_diff).then((diffData) => {
            setDiffObj(diffData)
        })
    }, [diff]);



    function getPubKey(id) {
        if (id !== '') {
            let pub = id

            const regex = new RegExp(`^${'npub1'}`);

            if (regex.test(id) && pub !== '') {
                try {
                    pub = nip19.decode(id).data
                    return pub
                } catch (error) {
                    console.error('NPUB is invalid.');
                }
            }
            return pub
        }
    }

    function getReadRelays() {
        return relays.filter(r => r[1].read).map(r => r[0])
    }

    function getWriteRelays() {
        return relays.filter(r => r[1].write).map(r => r[0])
    }

    function getAllRelays() {
        return relays.map(r => r[0])
    }

    async function getProfile() {
        try {
            // console.log("try...", pubKeyRef.current)
            const events = await window.pool.list(getReadRelays(), [{
                kinds: [0],
                authors: [pubKeyRef.current]
            }])
            // console.log(events)


            if (events.length > 0) {
                let p = {}
                events.sort((a, b) => b.created_at - a.created_at)

                p = JSON.parse(events[0].content)
                // console.log(p)
                return p
            }

            // console.log(events.length)
        }
        catch (error) {
            // check what is logging here
            console.log("error in fetchLogin", error)
            return error.response;
        }

    }

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
            'created_at': '',
            'name': '',
            'description': '',
            'image': '',
            'thumb': ''
        }
        // console.log(events)

        if (events.length > 0) {
            events.sort((a, b) => b.created_at - a.created_at)

            let tags = events[0].tags

            //console.log(tags)

            badgeInfo = {
                'badge_id': bid,
                'd': badgeId[2],
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

    async function getAcceptedBadges() {
        let events = await window.pool.list(getAllRelays(), [{
            kinds: [30_008],
            // p: [await window.nostr.getPublicKey()],
            authors: [pubKeyRef.current]
        }])

        let badges = []

        if (events.length > 0) {
            events.sort((a, b) => b.created_at - a.created_at)

            let event = events[0]
            badges = event.tags.filter(t => t[0] === 'a').map(t => t[1])
        }

        // console.log(badges)
        setBadges(badges)
    }

    async function getUnAcceptedBadges() {
        let events = await window.pool.list(getAllRelays(), [{
            kinds: [8],
            '#p': [pubKeyRef.current],
            // authors: [await window.nostr.getPublicKey()]
        }])

        const recieve_with_id = []

        events.forEach(event => {
            let a = event.id
            let b = event.tags.filter(t => t[0] === 'a').map(t => t[1])
            recieve_with_id.push([a, b[0]])
        });

        const recieve = recieve_with_id.map(b => b[1])
        // console.log(recieve_with_id)

        // const setBagdes = new Set(unbadges);
        const unique = recieve.filter(onlyUnique)
        const diff = unique.filter(x => !badges.includes(x));
        console.log(diff)

        // setDiff(diff)

        return diff

        // const uniqueBadgesObj = uniqueBadges.map(b=>(b[1]))

    }

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }

    return (
        <div>
            {/* <button className="button" type="button" onClick={() => { getUnAcceptedBadges() }}>getUnAcceptedBadges()</button> */}
            <ProfileMetaData profile={profile} />
            <ProfileBadges badgesObj={badgesObj} diffObj={diffObj} />
            <div>
                {/* {profile?.displayName} */}

                {/* <button className="button" type="button" onClick={() => { getProfile() }}>getProfile()</button> */}
            </div>
        </div>

    )
}


export default Profile