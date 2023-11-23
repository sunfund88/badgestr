import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import './Home.css'
import logo_image from '../../images/BadgeStr-Logo.gif'

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
        <div className='main'>
            <div className='home'>
                <div className='home-logo'>
                    <img src={logo_image} alt='nostr-logo'></img>
                    <div className='home-text'>
                        <h1>Badge<span className="purple">Str</span></h1>
                    </div>
                </div>
                <form onSubmit={onSubmit}>
                    <input className='home-input' ref={key} type='text' id='key' placeholder='Enter ... npub or pubkey(hex)'></input><br></br>
                    <button className='input-btn' type='submit'>Submit</button>
                </form>
            </div>
        </div>
    )
}


export default Home