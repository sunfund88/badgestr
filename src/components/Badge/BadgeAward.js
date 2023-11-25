import React, { useState, useRef, useEffect } from 'react';
import { getUsersRecievedBadge, getBadgeItem, getAllRelays, fetchFollowing, findDiffList, getUserName } from '../BadgeStrFunction';
import { useCookies } from 'react-cookie';
import BadgeAwardItem from './BadgeAwardItem';
import BadgeUserItem from './BadgeUserItem';

const BadgeAward = ({ badge, recieved, handleCloseParent }) => {
    const [selectListTxt, setSelectListTxt] = useState('-- Select List --');
    const [lists, setLists] = useState(undefined);
    const [awardList, setAwardList] = useState([]);
    const [listLoading, setListLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const options = ['-- Select List --', 'Following', 'Follower'];

    const [cookies, setCookie] = useCookies(['user']);

    const init_load = useRef(true)

    useEffect(() => {
        if (selectListTxt === 'Following') {
            console.log('selectFollowing')
            setListLoading(true)

            const fetchList = async () => {
                const fl = await fetchFollowing(cookies.user.pubkey)
                const list = findDiffList(fl, recieved)
                setLists(list)
                setListLoading(false)
            }
            fetchList()
        }
        else {
            setLists([])
        }
        setAwardList([])
    }, [selectListTxt])

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleSelect = (option) => {
        console.log('Selected option:', option);
        setSelectListTxt(option)
        setOpen(false);
    };

    const handleAdd = (user) => {
        if (!user[2]) {
            console.log('add')
            console.log(user)
            setAwardList([...awardList, user])
        }
    }

    const handleRemove = (user) => {
        if (!user[2]) {
            console.log('remove')

            const index = awardList.map(u => u[0]).indexOf(user[0])

            if (index !== -1) {
                const a = [...awardList]
                a.splice(index, 1)
                console.log(a)
                setAwardList(a)
            }
        }
    }

    function handleClose() {
        setSelectListTxt('-- Select List --')
        const e = []
        setLists(e)
        setAwardList(e)
        handleCloseParent()
    }

    return (
        <div className='award-modal-content' onClick={() => { }}>
            <span className="close" onClick={() => handleClose()}>&times;</span>
            <h1>Award Badge</h1>
            <h3>{badge?.name}</h3>

            <div className='award-container'>
                <div className='award-left'>
                    <h2>Add by pubkey</h2>
                    <input type='text' id='npub'></input>

                    <h2>Add from List</h2>

                    <div className='dropdown'>
                        <button className='dropdown-button' onClick={handleToggle}>{selectListTxt}</button>
                        {open && (
                            <ul className="dropdown-menu">
                                {options.map((option) => (
                                    <li key={option} onClick={() => handleSelect(option)}>
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className='award-list'>
                        {(lists !== undefined && lists.length !== 0)
                            ? <>
                                {lists.map((u, i) => (
                                    <BadgeAwardItem key={i} user={u} handleAdd={handleAdd} handleRemove={handleRemove} />
                                ))}
                            </>
                            : <div className='award-list-msg'>{(listLoading)
                                ? <label>Loading List ...</label>
                                : <label>No data.</label>}
                            </div>}
                    </div>

                </div>
                <div className='award-right'>
                    <h2>Award List <span>{awardList.length} User(s)</span></h2>

                    <div className='award-awardlist-container'>
                        <div className='award-awardlist'>
                            {(awardList !== undefined && awardList.length !== 0)
                                ? <>
                                    {awardList.map((u, i) => (
                                        <BadgeUserItem key={i} user={u} />
                                    ))}
                                </>
                                : <>No data.</>}
                        </div>
                    </div>
                    <h2>Award Btn</h2>

                </div>
            </div>


        </div >
    );
}

export default BadgeAward