import { nip19, getEventHash } from 'nostr-tools';

// relays
export const init_relays = [
    'wss://relay.damus.io',
    'wss://nostr-pub.wellorder.net',
    'wss://nos.lol',
    'wss://nostr.mom',
    'wss://offchain.pub'
].map(r => [r, { read: true, write: true }])

// relays
export async function findRelays() {
    let events = await window.pool.list(getAllRelays(), [{
        kinds: [3, 10_002],
        authors: [await window.nostr.getPublicKey()]
    }])

    if (events.length > 0) {
        events.sort((a, b) => b.created_at - a.created_at)

        console.log('relays ...', events)

        let event
        if (events[0].kind === 10_002) {
            event = events[0]
        }
        else {
            if (events[0].kind === 3 && (events[0].content !== '{}' && events[0].content !== '')) {
                event = events[0]
            }
            else if (events[1].kind === 10_002) {
                event = events[1]
            }
            else {
                console.log('Use init relays')

                return init_relays
            }
        }

        let new_relays = event.kind === 3
            ? Object.entries(JSON.parse(event.content))
            : event.tags
                .filter(t => t[0] === 'r')
                .map(t => [t[1], !t[2]
                    ? { read: true, write: true }
                    : { read: t[2] === 'read', write: t[2] === 'write' }])
        // console.log(new_relays)
        // console.log(event)

        return new_relays
        // setRelays(new_relays)
        // window.relays = relays
    }
    else return init_relays
}

export function getReadRelays() {
    return window.relays.filter(r => r[1].read).map(r => r[0])
}

export function getWriteRelays() {
    return window.relays.filter(r => r[1].write).map(r => r[0])
}

export function getAllRelays() {
    return window.relays.map(r => r[0])
}

// profile
export async function getWindowPubkey() {
    const wpk = await window.nostr.getPublicKey()
    return wpk
}

export function getPubKey(id) {
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

export async function getProfile(pubkey) {
    try {
        // console.log("try...", pubKeyRef.current)
        const events = await window.pool.list(getReadRelays(), [{
            kinds: [0],
            authors: [pubkey]
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

export async function getProfileArray(pubkey_arr) {
    try {
        // console.log("try...", pubKeyRef.current)
        const events = await window.pool.list(getReadRelays(), [{
            kinds: [0],
            authors: pubkey_arr
        }])

        return events
        // console.log(events)


        // if (events.length > 0) {
        //     let p = {}
        //     events.sort((a, b) => b.created_at - a.created_at)

        //     p = JSON.parse(events[0].content)
        //     // console.log(p)
        //     return p
        // }

        // console.log(events.length)
    }
    catch (error) {
        // check what is logging here
        console.log("error in fetchLogin", error)
        return error.response;
    }

}

export async function getAcceptedBadges(pubkey) {
    let events = await window.pool.list(getAllRelays(), [{
        kinds: [30_008],
        // p: [await window.nostr.getPublicKey()],
        authors: [pubkey]
    }])

    let tags = []

    if (events.length > 0) {
        events.sort((a, b) => b.created_at - a.created_at)

        let event = events[0]
        // badges = event.tags.filter(t => t[0] === 'a').map(t => t[1])
        tags = event.tags
    }

    tags.forEach((t, i) => {
        if (t[0] === 'a') {
            tags[i].push(tags[i + 1][1])
        }
    })

    const tags_a = tags.filter(t => t[0] === 'a')
    // console.log('tags_a', tags_a)

    tags_a.map(t => t.splice(0, 1))

    // console.log(events)
    // setBadges(badges)
    return tags_a
}

export function getBadgesId(badges) {
    return badges.map(t => t[0])
}

export async function getBadgeObj(badge) {
    const bid = badge
    badge = badge.split(':')
    let events = await window.pool.list(getReadRelays(), [{
        kinds: [30_009],
        authors: [badge[1]],
        '#d': [badge[2]]
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
            'd': badge[2],
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

// export async function getUnAcceptedBadges(pubkey, badges) {
//     let events = await window.pool.list(getReadRelays(), [{
//         kinds: [8],
//         '#p': [pubkey],
//         // authors: [await window.nostr.getPublicKey()]
//     }])

//     const recieve_with_id = []

//     events.forEach(event => {
//         let a = event.id
//         let b = event.tags.filter(t => t[0] === 'a').map(t => t[1])
//         recieve_with_id.push([a, b[0]])
//     });

//     const recieve = recieve_with_id.map(b => b[1]);

//     // const setBagdes = new Set(unbadges);
//     const unique = recieve.filter(onlyUnique);
//     // console.log('unique', unique)

//     // const unique_with_event =[]

//     // unique.forEach(u=>{

//     // })

//     const diff = unique.filter(x => !badges.includes(x));
//     // console.log('diff', diff)

//     const diff_with_id = []

//     diff.forEach(d => {
//         for (let i = 0; i < recieve_with_id.length; i++) {
//             if (d === recieve_with_id[i][1]) {
//                 diff_with_id.push([recieve_with_id[i][1], recieve_with_id[i][0]])
//                 break;
//             }
//         }
//     })

//     // console.log('diff_with_id ...', diff_with_id)

//     return diff_with_id
// }

export async function getAllRecievedBadges(pubkey) {
    let events = await window.pool.list(getReadRelays(), [{
        kinds: [8],
        '#p': [pubkey],
        // authors: [await window.nostr.getPublicKey()]
    }])

    const recieve_with_id = []


    events.forEach(event => {
        let a = event.id
        let b = event.tags.filter(t => t[0] === 'a').map(t => t[1])
        recieve_with_id.push([b[0], a])
    });

    const recieve = recieve_with_id.map(b => b[0]);
    // console.log('r...', recieve)
    const unique = recieve.filter(uniqueDiff);
    // console.log(unique)


    const unique_with_id = []

    unique.forEach(u => {
        for (let i = 0; i < recieve_with_id.length; i++) {
            if (u === recieve_with_id[i][0]) {
                unique_with_id.push([recieve_with_id[i][0], recieve_with_id[i][1]])
                break;
            }
        }
    })

    return unique_with_id
}

// export function findBadgeObj(badge_id, badgesData) {
//     // console.log('badge_id',badge_id)
//     return badgesData.filter(filterByKeyValue('badge_id', badge_id))
// }

export function getNewAcceptBadgesTags(newAcceptBadges) {
    // console.log('remove...', remove)
    // console.log('badges...', badges)

    let tags = [['d', 'profile_badges']]

    newAcceptBadges.forEach(b => {
        tags.push(['a', b[0]])
        tags.push(['e', b[1]])
    })

    return tags
    // console.log(badges)
}

// badge
export async function getUsersRecievedBadge(badge_id) {
    try {
        // console.log("try...", pubKeyRef.current)
        const events = await window.pool.list(getReadRelays(), [{
            kinds: [8],
            // authors: [pubkey]
            '#a': [badge_id]
        }])

        let p = []

        events.sort((a, b) => b.created_at - a.created_at)

        // console.log(events)

        events.forEach(e => {
            e.tags.forEach(t => {
                if (t[0] === 'p')
                    p.push(t[1])
            })
        })

        const unique = p.filter((value, index, array) => array.indexOf(value) === index);
        // console.log(unique)
        // // 

        const pf = await getProfileArray(unique)
        // console.log(pf)

        let pfarray = []
        pf.forEach(p => {
            let obj = [p.pubkey, JSON.parse(p.content)]
            pfarray.push(obj)
        })
        // console.log(pfarray)
        // console.log('u......', unique[0])

        const findProfile = (pk) => pfarray.filter(pfa => pk === pfa[0])[0]

        // console.log(findProfile(unique[0]))

        const unique_pf = unique.map(pk => findProfile(pk))


        //  pfarray.filter((value, index, array) => array.indexOf(value) === index);
        // console.log(unique_pf)
        return unique_pf
    }
    catch (error) {
        // check what is logging here
        console.log("error in fetchLogin", error)
        return error.response;
    }
}

export async function getCreatedBadges() {
    try {
        let events = await window.pool.list(getReadRelays(), [{
            kinds: [30_009],
            // '#p': [pubkey],
            // authors: [await getPubKey('npub1l2cp3t052ljhqnt2emsq5py30qqppj3pytprppc4ygjznhv6lzws99ye04')]
            authors: [await window.nostr.getPublicKey()]
        }])

        events.sort((a, b) => b.created_at - a.created_at)

        const unique_id = (events) => {
            const seenValues = {};
            const uniqueValues = [];

            for (const e of events) {
                const value = e.tags.filter(t => t[0] === 'd').map(m => m[1])[0]
                // console.log(value)
                if (!seenValues.hasOwnProperty(value)) {
                    seenValues[value] = true;
                    uniqueValues.push(e);
                }
            }

            return uniqueValues
        }

        const created = unique_id(events)

        console.log(created)

        return created

    } catch (error) {
        console.log("error in getCreatedBadges...", error)
        return error.response;
    }
}


export async function fetchBadgeInfoById(badgeId) {
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

export function getBadgeItem(badgeObj) {
    const bid = badgeObj.kind + ':' + badgeObj.pubkey + ':' + badgeObj.tags.filter(t => t[0] === 'd').map(t => t[1])[0]

    const badgeInfo = {
        'badge_id': bid,
        'd': badgeObj.tags.filter(t => t[0] === 'd').map(t => t[1])[0],
        'owner': badgeObj.pubkey,
        'created_at': badgeObj.created_at,
        'name': badgeObj.tags.filter(t => t[0] === 'name').map(t => t[1])[0],
        'description': badgeObj.tags.filter(t => t[0] === 'description').map(t => t[1])[0],
        'image': badgeObj.tags.filter(t => t[0] === 'image').map(t => t[1])[0],
        'thumb': badgeObj.tags.filter(t => t[0] === 'thumb').map(t => t[1])[0]
    }

    return badgeInfo
}


export async function sendNewEvent(kind, content, tags) {
    let new_event = {
        kind: kind,
        created_at: Math.floor(Date.now() / 1000),
        tags: tags,
        content: content,
        pubkey: await window.nostr.getPublicKey(),
    }

    new_event.id = getEventHash(new_event)
    new_event = await window.nostr.signEvent(new_event)
    console.log(new_event)

    let pubs = await window.pool.publish(getWriteRelays(), new_event)

    try {
        await Promise.all(pubs).then(() => {
            return true
        }
        )
        // .then((data) => {
        //     console.log('data...', data)
        //     // return data
        // });

        // const ev = await window.pool.get(getAllRelays(), { ids: [new_event.id], });
        // console.log(ev)
    } catch (error) {
        console.log(error)
        return false
    }
}


// test
export async function test_query(kind) {
    let events = await window.pool.list(getReadRelays(), [{
        kinds: [kind],
        // '#p': [pubkey],
        authors: [await window.nostr.getPublicKey()]
    }])

    console.log(events)
}

export async function test_sendNewEvent() {
    let kind = 8
    let content = ''
    // let tags = [
    //     [
    //         "d",
    //         "badgestr-friends"
    //     ],
    //     [
    //         "name",
    //         "BadgeStr Friends"
    //     ],
    //     [
    //         "description",
    //         "Created by BadgeStr for best friends"
    //     ],
    //     [
    //         "image",
    //         "https://i.imgur.com/ofFIeXY.gif"
    //     ],
    //     [
    //         "thumb",
    //         "https://i.imgur.com/ofFIeXY.gif"
    //     ]
    // ]
    let tags = [
        ['a', '30009:50e8ee3108cdfde4adefe93093cd38bd8692f59f250d3ee4294ef46dc102f370:badgestr-friends'],
        ['p', '50e8ee3108cdfde4adefe93093cd38bd8692f59f250d3ee4294ef46dc102f370']
    ]

    let new_event = {
        kind: kind,
        created_at: Math.floor(Date.now() / 1000),
        tags: tags,
        content: content,
        pubkey: await window.nostr.getPublicKey(),
    }

    new_event.id = getEventHash(new_event)
    new_event = await window.nostr.signEvent(new_event)
    console.log(new_event)

    let pubs = await window.pool.publish(getWriteRelays(), new_event)

    try {
        await Promise.all(pubs).then(() => {
            return true
        }
        )
        // .then((data) => {
        //     console.log('data...', data)
        //     // return data
        // });

        // const ev = await window.pool.get(getAllRelays(), { ids: [new_event.id], });
        // console.log(ev)
    } catch (error) {
        console.log(error)
        return false
    }
}

//
export function getUserName(profile) {
    let name = ''
    name = (profile?.name) ? (profile.name !== '' ? profile.name : name) : name
    name = (profile?.displayName) ? (profile.displayName !== '' ? profile.displayName : name) : name
    name = (profile?.display_name) ? (profile.display_name !== '' ? profile.display_name : name) : name

    return name
}

export function convertTime(timestamp) {
    if (timestamp !== undefined) {
        const date = new Date(timestamp * 1000);

        const readableDate = `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US')}`;

        return readableDate
    }
    else return ''
}

// export function onlyUnique(value, index, array) {
//     return array.indexOf(value) === index;
// }

export function uniqueDiff(value, index, array) {
    return array.indexOf(value) === index;
}

export function arrayDiff(array1, array2) {
    const diffArr = [];

    array1.forEach((r) => {
        let add = true
        for (let i = 0; i < array2.length; i++) {
            if (r[0] === array2[i][0]) {
                add = false
                break
            }
        }

        if (add) {
            diffArr.push(r)
        }

    })
    // for (const object of array1) {
    //     if (!array2.some(otherObject => object.id === otherObject.id)) {
    //         diff.push(object);
    //     }
    // }
    return diffArr;
}

// function filterByKeyValue(obj, key, value) {
//     return obj[key] === value;
// }

window.getAllRelays = getAllRelays
window.getWriteRelays = getWriteRelays
window.getReadRelays = getReadRelays
window.test_query = test_query
window.getCreatedBadges = getCreatedBadges
// window.getAllRecievedBadges = getAllRecievedBadges
window.test_sendNewEvent = test_sendNewEvent