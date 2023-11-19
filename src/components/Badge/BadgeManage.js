import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getCreatedBadges, getProfile, getUserName, getWindowPubkey } from '../BadgeStrFunction';
import BadgeManageCreatedItem from './BadgeManageCreatedItem';

const BadgeManage = () => {
    const [login, setLogin] = useState(false);
    const [profile, setProfile] = useState(null);
    const [createdBadges, setCreatedBadges] = useState([]);

    const init_Load = useRef(true)

    const navigate = useNavigate();

    useEffect(() => {
        if (init_Load) {
            init_Load.current = false;

            const fetchDataProfile = async () => {
                const pf = await getProfile(await getWindowPubkey())
                setProfile(pf)
            }
            fetchDataProfile()

            const fetchCreatedBadges = async () => {
                const created = await getCreatedBadges();
                setCreatedBadges(created)
            }

            fetchCreatedBadges()
        }
    }, []);

    async function handleClickProfile() {
        const url = '/p/' + await getWindowPubkey()

        navigate(url)
    }

    return (
        <div className='badge-manage'>
            {(profile !== null)
                ? <>
                    <div className="badge-manage-profile">
                        <img src={profile?.picture} alt={getUserName(profile)} onClick={() => handleClickProfile()}></img>
                        <h2 onClick={() => handleClickProfile()}>{getUserName(profile)}</h2>
                        <label onClick={() => handleClickProfile()}>Click to Profile</label>
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
    );
}

export default BadgeManage