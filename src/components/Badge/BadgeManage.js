import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getCreatedBadges, getProfile, getUserName, getUsersRecievedBadge, fetchPeopleList, getTitlePeopleList, getPeopleListFormat, } from '../BadgeStrFunction';
import BadgeManageCreatedItem from './BadgeManageCreatedItem';
import { useCookies } from 'react-cookie';
import BadgeAward from './BadgeAward';

const BadgeManage = () => {
    // const [login, setLogin] = useState(false);
    const [profile, setProfile] = useState(undefined);
    const [createdBadges, setCreatedBadges] = useState(undefined);

    const [showAwardModal, setShowAwardModal] = useState(false);
    const [awarding, setAwarding] = useState(undefined)
    const [recieve, setRecieve] = useState(undefined);

    const [peopleList, setPeopleList] = useState(undefined);
    const [titlePeopleList, setTitlePeopleList] = useState(undefined);

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
                    const created = await getCreatedBadges(cookies.user.pubkey);
                    setCreatedBadges(created)
                }
                fetchCreatedBadges()

                const fetchPList = async () => {
                    const people_list = await fetchPeopleList(cookies.user.pubkey);
                    setTitlePeopleList(getTitlePeopleList(people_list))
                    setPeopleList(await getPeopleListFormat(people_list))
                }
                fetchPList()
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

    async function handleAward(badge) {
        console.log('handleAward on manage')
        console.log(badge.pubkey)

        setShowAwardModal(true)
        setAwarding(badge)

        const fetchRecieve = async () => {
            const r = await getUsersRecievedBadge(badge.badge_id)

            setRecieve(r)
        }
        fetchRecieve()
    }

    function handleCloseParent() {
        setShowAwardModal(false)
    }

    return (
        <div className='main'>
            <div className='badge-manage'>
                {(profile !== undefined)
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

                {(createdBadges !== undefined)
                    ? <>
                        <h2>Created Badge</h2>
                        <div className='badge-created'>
                            {createdBadges.map((b, i) =>
                                <BadgeManageCreatedItem key={i} badge={b} handleAward={handleAward} />
                            )}
                        </div>
                    </>
                    : <></>
                }
            </div>

            <div className={`award-modal ${showAwardModal ? 'show' : ''}`} >
                {/* <div className='award-screen'> */}
                <BadgeAward badge={awarding} recieved={recieve} handleCloseParent={handleCloseParent} titlePeopleList={titlePeopleList} peopleList={peopleList} />
                {/* </div> */}
            </div>
        </div>
    );
}

export default BadgeManage