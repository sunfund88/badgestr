import React, { useState, useRef, useEffect } from 'react';
import { getBadgeItem } from '../BadgeStrFunction';

const BadgeManageCreatedItem = ({ badge }) => {
    const badgeItem = getBadgeItem(badge)
    return (
        <div className='badge-created-item'>
            <div>
                <img src={badgeItem.thumb} alt={badgeItem.name} />
            </div>
            <div className='badge-created-text'>
                <h4>{badgeItem.name}</h4>
                <div className='badge-created-description'>
                    {badgeItem.description}
                </div>
                <div className='badge-created-btn'>
                    <button type="button" >Edit</button>
                    <button type="button" >Award</button>
                </div>
            </div>

        </div>
    );
}

export default BadgeManageCreatedItem