import { useNavigate } from "react-router-dom";
import { nip19 } from "nostr-tools";


const ProfileBadgeItem = ({ id, badgeItem, type }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        // console.log("Image clicked!");

        const badge_data = badgeItem.badge_id.split(':')
        const relays = getAllRelays()

        const event = {
            pubkey: badge_data[1],
            relays,
            identifier: badge_data[2],
            kind: badge_data[0],
        }
        const naddr = nip19.naddrEncode(event)
        // console.log(naddr);


        const url = '/b/' + naddr

        navigate(url)

        // console.log(event)


    };

    function getAllRelays() {
        return window.relays.map(r => r[0])
    }

    // console.log()
    return (
        <>
            <li key={id}>
                <img className="image" src={badgeItem.thumb} width="120" height="120" title={badgeItem.name} alt={badgeItem.name}
                    onError={event => {
                        event.target.src = "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png"
                        event.onerror = null
                    }} onClick={handleClick} />{badgeItem.name}

                <div className="text"></div>
            </li>
        </>
    );
}

export default ProfileBadgeItem