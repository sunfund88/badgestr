export const init_relays = [
    'wss://relay.damus.io',
    'wss://nostr-pub.wellorder.net',
    'wss://nos.lol',
    'wss://nostr.mom',
    'wss://offchain.pub'
].map(r => [r, { read: true, write: true }])

export async function findRelays() {
    let events = await window.pool.list(getAllRelays(), [{
        kinds: [3, 10_002],
        authors: [await window.nostr.getPublicKey()]
    }])

    if (events.length > 0) {
        events.sort((a, b) => b.created_at - a.created_at)
        console.log(events)
        let event
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

        let new_relays = event.kind === 3
            ? Object.entries(JSON.parse(event.content))
            : event.tags
                .filter(t => t[0] === 'r')
                .map(t => [t[1], !t[2]
                    ? { read: true, write: true }
                    : { read: t[2] === 'read', write: t[2] === 'write' }])
        console.log(new_relays)
        console.log(event)

        return new_relays
        // setRelays(new_relays)
        // window.relays = relays
    }
    else return init_relays
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

export function getReadRelays() {
    return window.relays.filter(r => r[1].read).map(r => r[0])
}

export function getWriteRelays() {
    return window.relays.filter(r => r[1].write).map(r => r[0])
}

export function getAllRelays() {
    return window.relays.map(r => r[0])
}

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

export async function getRemainTags(remains) {
    let events = await window.pool.list(getReadRelays(), [{
        kinds: [30_008],
        authors: [await window.nostr.getPublicKey()],
        // authors: []
    }])

    let tags = []

    if (events.length > 0) {
        events.sort((a, b) => b.created_at - a.created_at)

        let event = events[0]
        // console.log(event)
        tags = event.tags

        // remains.forEach((b, i) => {
        //     if (b === tags[i][1]) {
        //         tags.splice(i, 2)
        //     }
        // });

    }
    return tags

    // console.log(badges)
    // setBadges(badges)
    // return events.sort((a, b) => b.created_at - a.created_at)
}

window.getAllRelays = getAllRelays
window.getWriteRelays = getWriteRelays
window.getReadRelays = getReadRelays
window.getAcceptedBadges_2 = getRemainTags