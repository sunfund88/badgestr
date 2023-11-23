import React, { useState, useEffect, useRef } from 'react';
import { nip19 } from "nostr-tools";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBadgeInfoById, getWindowPubkey, sendNewEvent } from '../BadgeStrFunction';

const BadgeEdit = () => {
    // const [isDisabled, setIsDisabled] = useState(false);
    let { id } = useParams();
    // console.log(id)

    const [badgeData, setBadgeData] = useState(undefined);

    const navigate = useNavigate();

    const badge_id = useRef('');
    const badge_name = useRef('');
    const badge_description = useRef('');
    const badge_image = useRef('');
    const badge_thumb = useRef('');

    const init_load = useRef(true)

    useEffect(() => {
        if (init_load) {
            init_load.current = false
            const badge_obj = nip19.decode(id)
            const badge_obj_id = badge_obj.data.kind + ':' + badge_obj.data.pubkey + ':' + badge_obj.data.identifier

            const fetchData = async () => {
                const badge_data = await fetchBadgeInfoById(badge_obj_id)

                setBadgeData(badge_data)
            }
            fetchData()
        }
    }, [])

    async function onSubmit(e) {
        e.preventDefault()
        const wpubkey = await getWindowPubkey()
        console.log(badgeData.owner)
        console.log(wpubkey)

        if (wpubkey === badgeData.owner) {

            let tags = []
            tags.push(["d", badge_id.current.value])
            tags.push(["name", badge_name.current.value])
            tags.push(["description", badge_description.current.value])
            tags.push(["image", badge_image.current.value, "1024x1024"])
            tags.push(["thumb", badge_thumb.current.value, "256x256"])


            await sendNewEvent(30_009, '', tags)

            navigate('/manage')
        }
        else {
            console.log('You can not edit this badge.')
            navigate('/manage')
        }
    }

    function pushBack() {
        // Prevent the back button from working
        window.history.back()
    }

    return (
        <div className='main'>
            <div className='badge-manage'>
                <div className='badge-manage-header'>
                    <button className='back_btn' onClick={() => { pushBack() }}> Back </button>
                </div>
                <h2>Edit Badge</h2>
                <div className='newbadge-container'>
                    <form onSubmit={onSubmit}>
                        <div className='newbadge-row'>
                            <h3>ID</h3>
                            <input className='newbadge-input' ref={badge_id} type='text' id='badge_id' defaultValue={badgeData?.d} placeholder='Badge ID for identifying the badge. (e.g. happy-nostrich)' disabled></input>
                        </div>
                        <div className='newbadge-row'>
                            <h3>Name</h3>
                            <input className='newbadge-input' ref={badge_name} type='text' id='badge_name' defaultValue={badgeData?.name} placeholder='Badge Name (e.g. Happy Nostrich) '></input>
                        </div>
                        <div className='newbadge-row'>
                            <h3>Description</h3>
                            <textarea className='input' ref={badge_description} type='text' id='badge_description' defaultValue={badgeData?.description} placeholder='Description here.'></textarea>
                        </div>
                        <div className='newbadge-row'>
                            <h3>Image</h3>
                            <input className='newbadge-input' ref={badge_image} type='text' id='badge_image' defaultValue={badgeData?.image} placeholder='Image url'></input>
                        </div>
                        <div className='newbadge-row'>
                            <h3>Thumbnail</h3>
                            <input className='newbadge-input' ref={badge_thumb} type='text' id='badge_thumb' defaultValue={badgeData?.thumb} placeholder='Thumbnail url'></input>
                        </div>
                        <div className='div-button'>
                            <button className='darkgreen-btn' type='submit'>Edit</button>
                            <input className='darkgrey-btn' type="reset" value="Reset" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BadgeEdit