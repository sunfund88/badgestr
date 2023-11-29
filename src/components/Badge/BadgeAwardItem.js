import React, { useState } from 'react';
import { getUserName } from '../BadgeStrFunction';

const BadgeAwardItem = ({ index, user, handleAdd, handleRemove, listadd }) => {

    const default_img = "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png"
    let img

    if (user[1]?.picture) {
        img = user[1]?.picture
    } else {
        img = default_img
    }

    function handleClick() {
        if (listadd) {
            handleRemove(user, index)
        }
        else {
            handleAdd(user, index)
        }
    }

    return (
        <div className={`award-item ${user[2] ? 'disable' : listadd ? 'add' : ''}`} onClick={handleClick}>
            <div className='award-item-name'>
                <img
                    src={img}
                    alt={user[1]?.name}
                    onError={event => {
                        event.target.src = default_img
                        event.onerror = null
                    }} />
                <h3>{getUserName(user[1])}</h3>
            </div>
            <div className='award-item-status'>
                {(user[2])
                    ? <label>Recieved</label>
                    : <>
                        {(listadd)
                            ? <h6>Add to Award List</h6>
                            : <></>}
                    </>
                }
            </div>
        </div>

    );
}

export default BadgeAwardItem