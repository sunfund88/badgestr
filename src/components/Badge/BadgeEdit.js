import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";

const BadgeNew = () => {
    const navigate = useNavigate();
    const badge_id = useRef('');
    const badge_name = useRef('');
    const badge_description = useRef('');
    const badge_image = useRef('');
    const badge_thumb = useRef('');

    function onSubmit(e) {
        e.preventDefault()

        let tags = []
        tags.push(["d", badge_id.current.value])
        tags.push(["name", badge_name.current.value])
        tags.push(["description", badge_description.current.value])
        tags.push(["image", badge_image.current.value, "1024x1024"])
        tags.push(["thumb", badge_thumb.current.value, "256x256"])

        console.log(tags)


        // ,
        // ,
        // ,

        // console.log({ id: key.current.value })

        // const url = '/p/' + key.current.value

        // navigate(url)
    }

    return (
        <>
            <h3>Create New Badge</h3>
            <div className='newbadge-container'>
                <form onSubmit={onSubmit}>
                    <div className='newbadge-row'>
                        <h3>ID</h3>
                        <input className='newbadge-input' ref={badge_id} type='text' id='badge_id' placeholder='Badge ID for identifying the badge. (e.g. happy-nostrich)'></input>
                    </div>
                    <div className='newbadge-row'>
                        <h3>Name</h3>
                        <input className='newbadge-input' ref={badge_name} type='text' id='badge_name' placeholder='Badge Name (e.g. Happy Nostrich) '></input>
                    </div>
                    <div className='newbadge-row'>
                        <h3>Description</h3>
                        <textarea className='input' ref={badge_description} type='text' id='badge_description' placeholder='Description here.'></textarea>
                    </div>
                    <div className='newbadge-row'>
                        <h3>Image</h3>
                        <input className='newbadge-input' ref={badge_image} type='text' id='badge_image' placeholder='Image url'></input>
                    </div>
                    <div className='newbadge-row'>
                        <h3>Thumbnail</h3>
                        <input className='newbadge-input' ref={badge_thumb} type='text' id='badge_thumb' placeholder='Thumbnail url'></input>
                    </div>
                    <button className='input-btn' type='submit'>Submit</button>
                </form>
            </div>
        </>
    );
}

export default BadgeNew