import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

const BadgeNew = () => {
    const [isDisabled, setIsDisabled] = useState(false);

    const navigate = useNavigate();
    const badge_id = useRef('');
    const badge_name = useRef('');
    const badge_description = useRef('');
    const badge_image = useRef('');
    const badge_thumb = useRef('');

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



        // ,
        // ,
        // ,

        // console.log({ id: key.current.value })

        // const url = '/p/' + key.current.value

        // navigate(url)
    }

    function onConfirm(e) {

        e.preventDefault()
        console.log('handleConfirm')

        let tags = []
        tags.push(["d", badge_id.current.value])
        tags.push(["name", badge_name.current.value])
        tags.push(["description", badge_description.current.value])
        tags.push(["image", badge_image.current.value, "1024x1024"])
        tags.push(["thumb", badge_thumb.current.value, "256x256"])

        console.log(tags)
    }

    return (
        <>
            <h3>Create New Badge</h3>

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
                        <div>
                            <button className='input-btn' type='submit'>Create</button>
                            <input className='input-btn' type="reset" value="Reset" />
                        </div>
                        : <>
                            <button className='input-btn' type='submit'>Edit</button>
                        </>}
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
                                <button className='input-btn' type='submit'>Confirm</button>
                            </div>
                            : <>
                            </>}
                    </div>
                </form>
            </div>


        </>
    );
}

export default BadgeNew