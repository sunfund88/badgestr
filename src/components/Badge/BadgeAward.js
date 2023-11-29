import React, { useState, useRef, useEffect } from 'react';
import { fetchFollowing, findDiffList, fetchFollower, getPubKey, getProfile, sendNewEvent } from '../BadgeStrFunction';
import { useCookies } from 'react-cookie';
import BadgeAwardItem from './BadgeAwardItem';
import BadgeAwardUserItem from './BadgeAwardUserItem';

const BadgeAward = ({ badge, recieved, handleCloseParent }) => {
    const [selectListTxt, setSelectListTxt] = useState('-- Select List --');
    // const [inputPub, setInputPub] = useState('');
    const [lists, setLists] = useState(undefined);
    const [awardList, setAwardList] = useState([]);
    const [listsAdd, setListsAdd] = useState([])
    const [listLoading, setListLoading] = useState(false);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [recievedLoadFinish, setRecievedLoadFinish] = useState(false);

    // const childRefs = useRef([]);

    const [open, setOpen] = useState(false);
    const options = ['-- Select List --', 'Following', 'Follower'];

    const [cookies, setCookie] = useCookies(['user']);

    const inputRef = useRef(null);

    // const addToListAdd = () => {
    //     setListsAdd([...listsAdd, false])
    // }
    // const revealRef = useRef([])
    // revealRef.current = []

    // const addToRef = (el) => {
    //     console.log('el', el)
    // }

    useEffect(() => {
        if (recieved !== undefined) {
            setRecievedLoadFinish(true)
        } else {
            setRecievedLoadFinish(false)
        }
    }, [recieved])

    useEffect(() => {
        if (selectListTxt === 'Following') {
            console.log('selectFollowing')
            setLists([])
            setListsAdd([])
            setListLoading(true)

            const fetchList = async () => {
                const fl = await fetchFollowing(cookies.user.pubkey)
                console.log('fl', fl)

                const list = findDiffList(fl, recieved)
                setLists(list)

                const la = list.map(item => false)

                setListsAdd(la)
                setListLoading(false)
            }
            fetchList()
        }
        else if (selectListTxt === 'Follower') {
            console.log('selectFollower')
            setLists([])
            setListLoading(true)

            const fetchList = async () => {
                const fl = await fetchFollower(cookies.user.pubkey)
                console.log('follower', fl)
                const list = findDiffList(fl, recieved)
                setLists(list)

                const la = list.map(item => false)

                setListsAdd(la)
                setListLoading(false)
            }
            fetchList()

        }
        else {
            setLists([])
        }
        setAwardList([])
        setIsSelectAll(false)
    }, [selectListTxt])

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleSelect = (option) => {
        console.log('Selected option:', option);
        setSelectListTxt(option)
        setOpen(false);
    };

    const handleAdd = (user, index) => {
        if (!user[2]) {
            console.log('add')
            console.log(index)
            setAwardList([...awardList, user])

            let a = listsAdd
            a[index] = true
            setListsAdd(a)

        }
    }

    const handleRemove = (user, i) => {
        if (!user[2]) {
            console.log('remove')

            const index = awardList.map(u => u[0]).indexOf(user[0])

            if (index !== -1) {
                const a = [...awardList]
                a.splice(index, 1)
                console.log(a)
                setAwardList(a)

                const la = listsAdd
                la[i] = false
                setListsAdd(la)
            }
        }
    }

    function handleClose() {
        setSelectListTxt('-- Select List --')
        const e = []
        setLists(e)
        setAwardList(e)
        setRecievedLoadFinish(false)
        setIsSelectAll(false)
        handleCloseParent()
    }

    async function handleAddByPubKey() {
        const pubkey = inputRef.current.value;
        if (pubkey !== '') {
            const pk = getPubKey(pubkey)
            inputRef.current.value = 'Loading ...'

            const pf = await getProfile(pk)

            const obj = [pk, pf, false]
            // console.log(obj)
            handleAdd(obj)
            inputRef.current.value = ''
        }
    }

    async function handleAward() {
        const wpubkey = cookies.user.pubkey
        if (badge.owner === wpubkey) {
            const tags = [['a', badge.badge_id]]

            awardList.forEach(u => {
                tags.push(['p', u[0]])
            });

            console.log(tags)

            await sendNewEvent(wpubkey, 8, '', tags)
            handleClose()
        }

    }

    function handleReset() {
        setSelectListTxt('-- Select List --')
        const e = []
        setLists(e)
        setAwardList(e)
    }

    function handleSelectAll() {
        if (!isSelectAll) {
            const u = lists.filter(l => l[2] === false)
            setAwardList(u)
            const l = listsAdd.map(item => true)
            setListsAdd(l)
            // childRefs[0].current.handleChildAdd()
            // childRefs.current.forEach((ref) => {
            //     ref.handleChildAdd();
            // });
        }
        else {
            setAwardList([])
            const l = listsAdd.map(item => false)
            setListsAdd(l)
            // childRefs.current.forEach((ref) => {
            //     ref.handleChildRemove();
            // });

        }
        setIsSelectAll(!isSelectAll)
    }

    return (
        <div className='award-modal-content' onClick={() => { }}>
            <div className='award-header-close'>
                <span className="close" onClick={() => handleClose()}>&times;</span>
            </div>
            <div className='award-header'>
                <h2>Award : {badge?.name}</h2>
            </div>

            <div className='award-container gap-2'>
                <div className='award-left'>
                    <h3>Add by pubkey</h3>
                    <div className='b-input'>
                        <input type='text' ref={inputRef} id='pubkey ' placeholder='pubkey or npub'></input>
                    </div>
                    <button className='award-button' onClick={() => handleAddByPubKey()}>Add to Award List</button>
                    {/* <h5>- or -</h5> */}
                    <h3>Add from List</h3>

                    <div className='dropdown'>
                        <button disabled={!recievedLoadFinish} className='dropdown-button' onClick={handleToggle}>{(recievedLoadFinish) ? selectListTxt : 'Loading...'} </button>
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
                    <div className='award-select'>
                        <span>{lists?.length} User(s)</span>
                        <div>
                            <input type="checkbox" checked={isSelectAll} onChange={handleSelectAll} />
                            <label> Select All</label>
                        </div>
                    </div>
                    <div className='award-list'>
                        {(lists !== undefined && lists.length !== 0)
                            ? <>
                                {lists.map((u, i) => (
                                    <BadgeAwardItem key={i} index={i} user={u} handleAdd={handleAdd} handleRemove={handleRemove} listadd={listsAdd[i]} />
                                ))}
                            </>
                            : <div className='award-list-msg'>{(listLoading)
                                ? <label>Loading List ...</label>
                                : <label>No data.</label>}
                            </div>}
                    </div>

                </div>
                <div className='award-right'>
                    <h3>Award List <span>{awardList.length} User(s)</span></h3>

                    <div className='award-awardlist-container'>
                        <div className='award-awardlist'>
                            {(awardList !== undefined && awardList.length !== 0)
                                ? <>
                                    {awardList.map((u, i) => (
                                        <BadgeAwardUserItem key={i} user={u} handleRemove={handleRemove} />
                                    ))}
                                </>
                                : <>No data.</>}
                        </div>
                    </div>
                    <button className='award-award-button' onClick={() => handleAward()}>Award</button>
                    <button className='award-reset-button' onClick={() => handleReset()}>Reset</button>

                </div>
            </div>


        </div >
    );
}

export default BadgeAward