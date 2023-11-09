import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import './Home.css'

function Home() {
    const navigate = useNavigate();
    const key = useRef()

    function onSubmit(e) {
        e.preventDefault()
        console.log({ id: key.current.value })

        const url = '/p/' + key.current.value

        navigate(url)

        // return <Navigate to={url} state={{ from: location }} />;
    }

    return (
        <div className='home'>
            <div className='home-logo'>
                <img src='https://user-images.githubusercontent.com/99301796/219719339-5eff628c-3470-4cc3-81eb-404f8902de9f.gif' width="300" height="300" alt='nostr-logo'></img>
            </div>
            <form onSubmit={onSubmit}>
                <input className='input' ref={key} type='text' id='key' placeholder='Enter ... npub or pubkey(hex)'></input><br></br>
                <button className='input-btn' type='submit'>Submit</button>
            </form>
        </div>
    )
}


export default Home