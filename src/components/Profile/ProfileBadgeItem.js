import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { nip19 } from "nostr-tools";

const ProfileBadgeItem = ({ id, badgeItem, type, editMode, removeBadges, handleRemoveLength }) => {
    const [removed, setRemoved] = useState(false)
    const [cssItem, setCssItem] = useState(editMode ? 'badges-item-edit' : 'badges-item')

    const navigate = useNavigate();

    useEffect(() => {
        setCssItem(editMode ? 'badges-item-edit' : 'badges-item')
        // console.log(removeBadges)
        if (removed) {
            const index = removeBadges.current.indexOf(badgeItem.badge_id);
            if (index > -1) {
                removeBadges.current.splice(index, 1);
            }
            setRemoved(!removed)
        }
    }, [editMode])

    useEffect(() => {
        if (editMode) {
            setCssItem(removed ? 'badges-item-edit-removed' : 'badges-item-edit')
            // console.log(removeBadges)
        }
        // removeBadges.current = []
    }, [removed])

    const handleClick = () => {
        // console.log("Image clicked!");

        if (!editMode) {
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
        }
        else {
            if (!removed) {
                removeBadges.current.push(badgeItem.badge_id)
                setRemoved(!removed)
            }
            else {
                const index = removeBadges.current.indexOf(badgeItem.badge_id);
                if (index > -1) {
                    removeBadges.current.splice(index, 1);
                }
                setRemoved(!removed)
            }
            handleRemoveLength()
            // console.log(removeBadges.current)
        }

        // console.log(event)


    };

    function getAllRelays() {
        return window.relays.map(r => r[0])
    }

    // console.log()
    return (
        <div className={cssItem} key={id} onClick={handleClick} >
            <img className="image" src={badgeItem.thumb} width="120" height="120" title={badgeItem.name} alt={badgeItem.name}
                onError={event => {
                    event.target.src = "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png"
                    event.onerror = null
                }} />
            <div className="badges-item-name">
                {badgeItem.name}
            </div>

            {/* <div className="text"></div> */}
        </div>
    );
}

export default ProfileBadgeItem