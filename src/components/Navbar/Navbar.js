import React, { useState, useEffect } from 'react';
import './Navbar.css'
import { findRelays, getAllRelays, getReadRelays, init_relays } from '../BadgeStrFunction';

function Navbar() {
    const [login, setLogin] = useState((localStorage.getItem('login') === 'true'));
    const [userLogin, setUserLogin] = useState(JSON.parse(localStorage.getItem('user')));
    const [relays, setRelays] = useState(getAllRelays);

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

    async function handleLogin() {
        const tlogin = login
        setLogin(!login)

        if (!tlogin) {
            localStorage.setItem('login', 'true');
            const u = await getProfile()
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

    async function getProfile() {
        try {
            const pubkey = await window.nostr.getPublicKey()
            // console.log("try...",)
            const events = await window.pool.list(getReadRelays(), [{
                kinds: [0],
                authors: [pubkey]
            }])
            // console.log(events)


            if (events.length > 0) {
                let p = {}
                events.sort((a, b) => b.created_at - a.created_at)

                p = JSON.parse(events[0].content)
                // console.log(p)
                return p
            }

            // console.log(events.length)
        }
        catch (error) {
            // check what is logging here
            console.log("error in fetchLogin", error)
            return error.response;
        }

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
                        {userLogin?.display_name} <img src={userLogin?.picture} width="30" height="30" alt={userLogin?.name} onError={event => {
                            event.target.src = "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png"
                            event.onerror = null
                        }} />
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