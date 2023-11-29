import React, { useState, useRef, useEffect } from 'react';
import { getBadgeItem, getAllRelays } from '../BadgeStrFunction';
import { nip19 } from "nostr-tools";
import { useNavigate } from "react-router-dom";

const BadgeManageCreatedItem = ({ badge, handleAward }) => {
    const badgeItem = getBadgeItem(badge)

    const navigate = useNavigate();

    function handleEdit() {
        console.log('handleEdit')

        const relays = getAllRelays()

        const event = {
            pubkey: badgeItem.owner,
            relays,
            identifier: badgeItem.d,
            kind: 30009,
        }
        // console.log(event)
        const naddr = nip19.naddrEncode(event)
        console.log(naddr);

        const url = '/edit/' + naddr
        console.log(url)
        navigate(url)

    }

    function handleClick() {
        const relays = getAllRelays()

        const event = {
            pubkey: badge.pubkey,
            relays,
            identifier: badgeItem.d,
            kind: badge.kind,
        }
        const naddr = nip19.naddrEncode(event)
        // console.log(naddr);

        const url = '/b/' + naddr

        navigate(url)

    }

    // function handleAward() {
    //     console.log('handleAward')


    //     // const badge_data = badgeItem.badge_id.split(':')
    //     // const relays = getAllRelays()

    //     // const event = {
    //     //     pubkey: badge_data[1],
    //     //     relays,
    //     //     identifier: badge_data[2],
    //     //     kind: badge_data[0],
    //     // }
    //     // const naddr = nip19.naddrEncode(event)
    //     // // console.log(naddr);

    //     // const url = '/b/' + naddr

    //     // navigate(url)
    // }

    return (
        <div className='badge-created-item'>
            <div>
                <img src={badgeItem.thumb} alt={badgeItem.name} onClick={handleClick} />
            </div>
            <div className='badge-created-text'>
                <h4 onClick={handleClick} >{badgeItem.name}</h4>
                <div className='badge-created-description'>
                    {badgeItem.description}
                </div>
                <div className='div-button2'>
                    <button className='darkgrey-btn' type="button" onClick={() => handleEdit()} >Edit</button>
                    <button className='darkgrey-btn' type="button" onClick={() => handleAward(badgeItem)} >Award</button>
                </div>
            </div>

        </div>
    );
}

export default BadgeManageCreatedItem