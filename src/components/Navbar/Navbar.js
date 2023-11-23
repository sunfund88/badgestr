import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css'
import { findRelays, getAllRelays, init_relays, getProfile, getWindowPubkey } from '../BadgeStrFunction';
import { useNavigate } from "react-router-dom";
import logo_image from '../../images/BadgeStr-Logo2.svg'
import { useCookies } from 'react-cookie';

// import { relayInit } from 'nostr-tools';

function Navbar() {
    const [cookies, setCookie] = useCookies(['user']);
    const [login, setLogin] = useState(false);
    const [userLogin, setUserLogin] = useState(undefined);
    const [relays, setRelays] = useState(getAllRelays());

    const init_load = useRef(true)

    const navigate = useNavigate();

    useEffect(() => {
        if (init_load.current) {
            init_load.current = false

            console.log('init......', cookies.user)
            if (cookies.user === '' || cookies.user === undefined) {
                console.log('Not Login')
                // setLogin(false)
            }
            else {
                console.log('Login')
                setLogin(true)

                // check same user in cookie
                // const fetchWindowUser = async () => {
                //     const win_pubkey = await getWindowPubkey()
                //     console.log('win_pubkey...', win_pubkey)

                //     // if (win_pubkey !== cookies.user.pubkey) {
                //     //     console.log('Fetch new profile...')

                //     //     let u = await getProfile(win_pubkey)
                //     //     u.pubkey = win_pubkey
                //     //     setCookie('user', JSON.stringify(u))
                //     //     setUserLogin(u)
                //     //     window.relays = await findRelays();
                //     //     setRelays(getAllRelays)
                //     // }
                //     // else {
                //     //     setUserLogin(cookies.user)
                //     // }
                // }
                // fetchWindowUser()

                setUserLogin(cookies.user)

                async function fetchRelays() {
                    window.relays = await findRelays();
                    setRelays(getAllRelays)
                }

                fetchRelays()

            }
        }
    }, []);

    // useEffect(() => {
    //     if (init_Load) {
    //         init_Load.current = false;
    //         // setCookie('name', 'newName');

    //         console.log('init......', cookies.user)

    //         if (cookies.user === 'undefined') {
    //             setLogin(false)
    //             setUserLogin(undefined)
    //             console.log('ff')
    //         }
    //         else {
    //             setLogin(true)
    //             setUserLogin(cookies.user)
    //             console.log('userLogin', userLogin)
    //         }

    //         // setLogin(localStorage.getItem('login') === 'true');
    //         // setUserLogin(JSON.parse(localStorage.getItem('user')));
    //         setRelays(getAllRelays())
    //     }
    // }, []);

    // useEffect(() => {
    //     if (login) {
    //         const fetchRelays = async () => {
    //             window.relays = await findRelays();
    //             setRelays(getAllRelays)
    //         }

    //         fetchRelays()

    //         const fetchWindowPubKey = async () => {
    //             const win_pubkey = await getWindowPubkey()
    //             // console.log(win_pubkey)
    //             // console.log(userLogin.pubkey)

    //             if (win_pubkey !== userLogin?.pubkey) {
    //                 console.log('load new profile...')
    //                 const u = await getProfile(win_pubkey)
    //                 u.pubkey = win_pubkey
    //                 console.log('u', u)
    //                 setUserLogin(u)
    //                 // localStorage.setItem('user', JSON.stringify(u));
    //                 setCookie('user', JSON.stringify(u))
    //             }
    //         }

    //         fetchWindowPubKey()
    //     }
    //     else {
    //         window.relays = init_relays
    //         setRelays(getAllRelays)
    //         setCookie('user', undefined)
    //     }

    // }, [login]);

    // useEffect(() => {
    //     let r = relayInit(relays[0])
    //     console.log(await r.connect())

    // }, [relays]);

    async function handleMyProfile() {
        const url = '/manage'

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
            // localStorage.setItem('login', 'true');
            const pk = await getWindowPubkey()
            // console.log(pk)
            const u = await getProfile(pk)
            u.pubkey = pk

            setUserLogin(u)
            setCookie('user', JSON.stringify(u))
            window.relays = await findRelays();
            setRelays(getAllRelays)
            // localStorage.setItem('user', JSON.stringify(u));
        }
        else {
            // localStorage.setItem('login', 'false');
            setUserLogin(undefined)
            setCookie('user', JSON.stringify(''))
            window.relays = init_relays;
            setRelays(getAllRelays)
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
                    <div className="nav-user gap">
                        <div className='nav-user-name gap' onClick={() => { handleMyProfile() }}>
                            <label>{userLogin?.display_name} </label>
                            <img src={userLogin?.picture} alt={userLogin?.name} onError={event => {
                                event.target.src = "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png"
                                event.onerror = null
                            }} />
                        </div>
                        <div className='nav-btn-div gap'>
                            <button className="nav-btn-newbadge" type="button" onClick={() => { handleAddNewBadge() }}>+ Badge</button>
                            <button className="nav-btn" type="button" onClick={() => { handleLogin() }}>Log out</button>
                        </div>
                        {/* <button id="menuButton">Open Menu</button>
                        <div>
                            <ul>
                                <li><a href="#">Home</a></li>
                                <li><a href="#">About</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div> */}
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