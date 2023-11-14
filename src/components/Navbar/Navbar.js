import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css'
import { findRelays, getAllRelays, getReadRelays, init_relays, getProfile } from '../BadgeStrFunction';
import { useNavigate } from "react-router-dom";
import { relayInit } from 'nostr-tools';

function Navbar() {
    const [login, setLogin] = useState(false);
    const [userLogin, setUserLogin] = useState({});
    const [relays, setRelays] = useState(getAllRelays);

    const init_LoadPage = useRef(true)

    const navigate = useNavigate();

    useEffect(() => {
        if (init_LoadPage) {
            init_LoadPage.current = false;
            setLogin(localStorage.getItem('login') === 'true');

            setUserLogin(JSON.parse(localStorage.getItem('user')));

        }
    }, []);

    useEffect(() => {
        if (login) {
            const fetchRelays = async () => {
                window.relays = await findRelays();
                setRelays(getAllRelays)
            }

            fetchRelays()
        }
        else {
            window.relays = init_relays
            setRelays(getAllRelays)
        }

    }, [login]);

    // useEffect(() => {
    //     let r = relayInit(relays[0])
    //     console.log(await r.connect())

    // }, [relays]);

    async function handleMyProfile() {
        const mypub = await window.nostr.getPublicKey()
        const url = '/p/' + mypub

        navigate(url)
        window.location.reload()

    }

    async function handleLogin() {
        const tlogin = login
        setLogin(!login)

        if (!tlogin) {
            localStorage.setItem('login', 'true');
            const u = await getProfile(await window.nostr.getPublicKey())
            setUserLogin(u)
            localStorage.setItem('user', JSON.stringify(u));

        }
        else {
            localStorage.setItem('login', 'false');
            setUserLogin({})
            localStorage.setItem('user', JSON.stringify({}));
        }

        // console.log(login)
    }

    return (
        <>
            <nav>
                <div className="logo">
                    <a href="/"><h1>Badge<span className="purple">Str</span></h1></a>
                </div>

                {(login === true)
                    ?
                    <div className="nav-user">
                        <div className='nav-user-name' onClick={() => { handleMyProfile() }}>
                            {userLogin?.display_name} <img src={userLogin?.picture} width="30" height="30" alt={userLogin?.name} onError={event => {
                                event.target.src = "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png"
                                event.onerror = null
                            }} />
                        </div>
                        <button className="nav-btn" type="button" onClick={() => { handleLogin() }}>Log out</button>
                    </div>
                    : <button className="nav-btn" type="button" onClick={() => { handleLogin() }}>Log in</button>}


            </nav>
            <div className='relay'>
                <div className='relay-list'>
                    <h5>Relays:</h5>
                    <ul>
                        {relays.map((r, i) => (
                            <li key={i}><h5>- {r}</h5></li>
                        )
                        )}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Navbar