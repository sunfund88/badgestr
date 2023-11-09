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

    let { id } = useParams();
    const pubKeyRef = useRef(getPubKey(id))
    const shouldLog = useRef(true)

    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false
            const fetchDataProfile = async () => {
                const pf = await getProfile()
                getAcceptedBadges()

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

        Promise.all(promises).then((updateData) => {
            setBadgesObj(updateData)
        })
    }, [badges]);



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
            console.log("try...", pubKeyRef.current)
            const events = await window.pool.list(getReadRelays(), [{
                kinds: [0],
                authors: [pubKeyRef.current]
            }])
            console.log(events)


            if (events.length > 0) {
                let p = {}
                events.sort((a, b) => b.created_at - a.created_at)

                p = JSON.parse(events[0].content)
                console.log(p)
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
        badgeId = badgeId.split(':')
        let events = await window.pool.list(getReadRelays(), [{
            kinds: [30_009],
            authors: [badgeId[1]],
            '#d': [badgeId[2]]
        }])
        console.log(badgeId[2])

        let badgeInfo = {
            'd': '',
            'name': '',
            'description': '',
            'image': '',
            'thumb': ''
        }
        console.log(events)

        if (events.length > 0) {
            events.sort((a, b) => b.created_at - a.created_at)

            let tags = events[0].tags

            console.log(tags)

            badgeInfo = {
                'd': badgeId[2],
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

        console.log(badges)
        setBadges(badges)
    }

    return (
        <div>
            {/* <h1>Profile :{pubKeyRef?.current}</h1> */}
            <ProfileMetaData profile={profile} />
            <ProfileBadges badgesObj={badgesObj} />
            <div>
                {/* {profile?.displayName} */}

                {/* <button className="button" type="button" onClick={() => { test() }}>test()</button> */}
                {/* <button className="button" type="button" onClick={() => { getProfile() }}>getProfile()</button> */}
            </div>
        </div>

    )
}


export default Profile