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
    return await window.nostr.getPublicKey()
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
    const unique = recieve.filter(onlyUnique);
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


export async function test_sendNewEvent() {
    let kind = 30_008
    let content = ''
    let tags = [['d', 'profile_badges'],
    ['a', '30009:58f5a23008ba5a8730a435f68f18da0b10ce538c6e2aa5a1b7812076304d59f7:siamstr'],
    ['e', 'd34ce80ab2cf520127a5d863d6b5735110d1d5d292b82e335ed1ffe620248697'],
    ['a', '30009:d830ee7b7c30a364b1244b779afbb4f156733ffb8c87235086e26b0b4e61cd62:Jakk'],
    ['e', '1fac4c30c01924154ece306233e4c8a8c6e5bf5d0d0a1d54cd50f5909951ee07'],
    ['a', '30009:f031d7551cc90a697461550cf916ac063daed6a3faeb3fd7b0cdf0b65e9e0d4d:i_badges_02'],
    ['e', '38399b5b71f8fb2bfca364a1ef10d26b6e0ccb6240bd8013b12d79b18eb7c4fc']
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
export function convertTime(timestamp) {
    if (timestamp !== undefined) {
        const date = new Date(timestamp * 1000);

        const readableDate = `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US')}`;

        return readableDate
    }
    else return ''
}

export function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

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

function filterByKeyValue(obj, key, value) {
    return obj[key] === value;
}


window.getAllRelays = getAllRelays
window.getWriteRelays = getWriteRelays
window.getReadRelays = getReadRelays
// window.getAllRecievedBadges = getAllRecievedBadges
// window.test_sendNewEvent = test_sendNewEvent