import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getCreatedBadges, getProfile, getUserName } from '../BadgeStrFunction';
import BadgeManageCreatedItem from './BadgeManageCreatedItem';
import { useCookies } from 'react-cookie';

const BadgeManage = () => {
    // const [login, setLogin] = useState(false);
    const [profile, setProfile] = useState(null);
    const [createdBadges, setCreatedBadges] = useState([]);
    const [cookies, setCookie] = useCookies(['user']);

    const init_Load = useRef(true)

    const navigate = useNavigate();

    useEffect(() => {
        if (init_Load.current) {
            init_Load.current = false;

            if (cookies.user === '' || cookies.user === undefined) {
                console.log('Not Login')
                navigate('/')
                window.location.reload()
            }
            else {
                const fetchDataProfile = async () => {
                    const pf = await getProfile(cookies.user.pubkey)
                    setProfile(pf)
                }
                fetchDataProfile()

                const fetchCreatedBadges = async () => {
                    const created = await getCreatedBadges();
                    setCreatedBadges(created)
                }

                fetchCreatedBadges()
            }
        }
    }, []);

    async function handleClickProfile() {
        const url = '/p/' + cookies.user.pubkey

        navigate(url)
    }

    function handleLogout() {

        setCookie('user', JSON.stringify(''))
        // window.relays = init_relays;
        // setRelays(getAllRelays)
        navigate('/')
        window.location.reload()
    }

    function handleAddNewBadge() {
        console.log('handleAddNewBadge...')
        navigate('/new')
    }

    return (
        <div className='main'>
            <div className='badge-manage'>
                {(profile !== null)
                    ? <>
                        <div className="badge-manage-profile">
                            <img src={profile?.picture} alt={getUserName(profile)} onClick={() => handleClickProfile()}></img>
                            <h2 onClick={() => handleClickProfile()}>{getUserName(profile)}</h2>
                            <label onClick={() => handleClickProfile()}>Click to Profile</label>
                        </div>
                        <div className='badge-manage-button'>
                            <button className="nav-btn-newbadge" type="button" onClick={() => { handleAddNewBadge() }}>+ Badge</button>
                            <button className="nav-btn" type="button" onClick={() => { handleLogout() }}>Log out</button>

                        </div>
                    </>
                    : <></>
                }

                {(createdBadges.length > 0)
                    ? <>
                        <h2>Created Badge</h2>
                        <div className='badge-created'>
                            {createdBadges.map((b, i) =>
                                <BadgeManageCreatedItem key={i} badge={b} />
                            )}
                        </div>
                    </>
                    : <></>
                }
            </div>
        </div>
    );
}

export default BadgeManage