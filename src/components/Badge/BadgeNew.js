import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";

const BadgeNew = () => {
    const navigate = useNavigate();
    const badge_id = useRef();
    const badge_name = useRef();

    function onSubmit(e) {
        // e.preventDefault()
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
                        <textarea className='input' ref={badge_name} type='text' id='badge_name' placeholder='Description here.'></textarea>
                    </div>
                    <div className='newbadge-row'>
                        <h3>Image</h3>
                        <input className='newbadge-input' ref={badge_name} type='text' id='badge_name' placeholder='Image url'></input>
                    </div>
                    <div className='newbadge-row'>
                        <h3>Thumbnail</h3>
                        <input className='newbadge-input' ref={badge_name} type='text' id='badge_name' placeholder='Thumbnail url'></input>
                    </div>
                    <button className='input-btn' type='submit'>Submit</button>
                </form>
            </div>
        </>
    );
}

export default BadgeNew