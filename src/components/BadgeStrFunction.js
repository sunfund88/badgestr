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

export function convertTime(timestamp) {
    if (timestamp !== undefined) {
        const date = new Date(timestamp * 1000);

        const readableDate = `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US')}`;

        return readableDate
    }
    else return ''
}