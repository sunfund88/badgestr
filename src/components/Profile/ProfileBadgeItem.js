import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { nip19 } from "nostr-tools";
import { getAllRelays } from '../BadgeStrFunction';

const ProfileBadgeItem = ({ id, index, badgeItem, type, editMode, handleEdit }) => {
    // const [removed, setRemoved] = useState(false)
    const [cssItem, setCssItem] = useState(editMode ? (type ? 'badges-item edit-green' : 'badges-item edit-red') : 'badges-item')

    const navigate = useNavigate();

    useEffect(() => {
        setCssItem(editMode ? (type ? 'badges-item edit-green' : 'badges-item edit-red') : 'badges-item')
        // console.log(removeBadges)
        // if (removed) {
        //     const index = removeBadges.current.indexOf(badgeItem.badge_id);
        //     if (index > -1) {
        //         removeBadges.current.splice(index, 1);
        //     }
        //     setRemoved(!removed)
        // }
    }, [editMode])

    // useEffect(() => {
    //     if (editMode) {
    //         setCssItem(removed ? 'badges-item-edit-removed' : 'badges-item-edit')
    //         // console.log(removeBadges)
    //     }
    //     // removeBadges.current = []
    // }, [removed])

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
            // if (!removed) {
            //     removeBadges.current.push(badgeItem.badge_id)
            //     setRemoved(!removed)
            // }
            // else {
            //     const index = removeBadges.current.indexOf(badgeItem.badge_id);
            //     if (index > -1) {
            //         removeBadges.current.splice(index, 1);
            //     }
            //     setRemoved(!removed)
            // }
            handleEdit(type, index)
            // console.log(removeBadges.current)
        }

        // console.log(event)


    };

    // console.log()
    return (
        (badgeItem !== undefined)
            ? <div className={cssItem} key={id} onClick={handleClick} >
                <img class="image" src={badgeItem?.thumb} title={badgeItem?.name} alt={badgeItem?.name}
                    onError={event => {
                        event.target.src = "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png"
                        event.onerror = null
                    }} />
                <div className="badges-item-name">
                    {badgeItem?.name}
                </div>

                {/* <div className="text"></div> */}
            </div>
            : <></>
    );
}

export default ProfileBadgeItem