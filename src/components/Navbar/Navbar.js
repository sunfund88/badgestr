import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css'
import { findRelays, getAllRelays, getReadRelays, init_relays, getProfile, getWindowPubkey } from '../BadgeStrFunction';
import { useNavigate } from "react-router-dom";
import logo_image from '../../images/BadgeStr-Logo2.svg'
import { relayInit } from 'nostr-tools';

function Navbar() {
    const [login, setLogin] = useState(false);
    const [userLogin, setUserLogin] = useState({});
    const [relays, setRelays] = useState(getAllRelays());

    const init_Load = useRef(true)

    const navigate = useNavigate();

    useEffect(() => {
        if (init_Load) {
            init_Load.current = false;
            setLogin(localStorage.getItem('login') === 'true');
            setUserLogin(JSON.parse(localStorage.getItem('user')));
            setRelays(getAllRelays())
        }
    }, []);

    useEffect(() => {
        if (login) {
            const fetchRelays = async () => {
                window.relays = await findRelays();
                setRelays(getAllRelays)
            }

            fetchRelays()

            const fetchWindowPubKey = async () => {
                const win_pubkey = await getWindowPubkey()

                // console.log(win_pubkey.current)
                // console.log(userLogin.pubkey)

                if (win_pubkey === userLogin.pubkey) {
                    console.log('same pubkey...')
                } else {
                    console.log('load new pubkey...')
                    const u = await getProfile(win_pubkey)
                    setUserLogin(u)
                    localStorage.setItem('user', JSON.stringify(u));

                }
            }

            fetchWindowPubKey()
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

    function handleAddNewBadge() {
        console.log('handleAddNewBadge...')
        navigate('/new')
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
                    <div><img src={logo_image} width="45" height="45" /></div>
                    <a href="/">
                        <h1>Badge<span className="purple">Str</span></h1>
                    </a>
                </div>

                {(login === true)
                    ?
                    <div className="nav-user">
                        <div className='nav-user-name' onClick={() => { handleMyProfile() }}>
                            {userLogin?.display_name} <img src={userLogin?.picture} alt={userLogin?.name} onError={event => {
                                event.target.src = "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png"
                                event.onerror = null
                            }} />
                        </div>
                        <button className="nav-btn-newbadge" type="button" onClick={() => { handleAddNewBadge() }}>+ Badge</button>
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