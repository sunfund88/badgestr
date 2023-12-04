import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { sendNewEvent } from '../BadgeStrFunction';
import { useCookies } from 'react-cookie';

const BadgeNew = () => {
    const [isDisabled, setIsDisabled] = useState(false);

    const navigate = useNavigate();
    const badge_id = useRef('');
    const badge_name = useRef('');
    const badge_description = useRef('');
    const badge_image = useRef('');
    const badge_thumb = useRef('');

    const [cookies, setCookie] = useCookies(['user']);
    const init_load = useRef(true)

    useEffect(() => {
        if (init_load.current) {
            init_load.current = false;

            if (cookies.user === '' || cookies.user === undefined) {
                console.log('Not Login')
                navigate('/')
                window.location.reload()
            }
        }
    }, [])

    function onSubmit(e) {
        e.preventDefault()

        if (badge_id.current.value !== '' &&
            badge_name.current.value !== '' &&
            badge_description.current.value !== '' &&
            badge_image.current.value !== '' &&
            badge_thumb.current.value !== '') {

            setIsDisabled(!isDisabled)
            console.log(isDisabled)
        }
    }

    async function onConfirm(e) {

        e.preventDefault()
        console.log('handleConfirm')

        let tags = []
        tags.push(["d", badge_id.current.value])
        tags.push(["name", badge_name.current.value])
        tags.push(["description", badge_description.current.value])
        tags.push(["image", badge_image.current.value, "1024x1024"])
        tags.push(["thumb", badge_thumb.current.value, "256x256"])

        console.log(tags)

        await sendNewEvent(cookies.user.pubkey, 30_009, '', tags)

        navigate('/manage')
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
                <h2>Create New Badge</h2>

                <div className='newbadge-container'>
                    <form onSubmit={onSubmit}>
                        <div className='newbadge-row'>
                            <h3>ID</h3>
                            <input ref={badge_id} type='text' id='badge_id' placeholder='Badge ID for identifying the badge. (e.g. happy-nostrich)' disabled={isDisabled}></input>
                        </div>
                        <div className='newbadge-row'>
                            <h3>Name</h3>
                            <input ref={badge_name} type='text' id='badge_name' placeholder='Badge Name (e.g. Happy Nostrich)' disabled={isDisabled}></input>
                        </div>
                        <div className='newbadge-row'>
                            <h3>Description</h3>
                            <textarea ref={badge_description} type='text' id='badge_description' placeholder='Description here.' disabled={isDisabled}></textarea>
                        </div>
                        <div className='newbadge-row'>
                            <h3>Image</h3>
                            <input ref={badge_image} type='url' id='badge_image' placeholder='Image url' disabled={isDisabled}></input>
                        </div>
                        <div className='newbadge-row'>
                            <h3>Thumbnail</h3>
                            <input ref={badge_thumb} type='url' id='badge_thumb' placeholder='Thumbnail url' disabled={isDisabled}></input>
                        </div>
                        {(!isDisabled)
                            ?
                            <div className='div-button'>
                                <button className='main-btn' type='submit'>Create</button>
                                <input className='darkgrey-btn' type="reset" value="Reset" />
                            </div>
                            :
                            <div className='div-button'>
                                <button className='darkgrey-btn' type='submit'>Edit</button>
                            </div>}
                    </form>

                    <form onSubmit={onConfirm}>
                        <div className='newbadge-row'>
                            {(isDisabled)
                                ?
                                <div className='badge-created'>
                                    <div className='badge-created-item'>
                                        <div>
                                            <img src={badge_thumb.current.value} alt={badge_name.current.value} />
                                        </div>
                                        <div className='badge-created-text'>
                                            <h4>{badge_name.current.value}</h4>
                                            <div className='badge-created-description'>
                                                {badge_description.current.value}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='div-button'>
                                        <button className='darkgreen-btn' type='submit'>Confirm</button>
                                    </div>
                                </div>
                                : <>
                                </>}
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default BadgeNew