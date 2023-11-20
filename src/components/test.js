import React, { useState } from "react";
import { test_sendNewEvent } from "./BadgeStrFunction";
import { useCookies } from 'react-cookie';

const Test = () => {
    const [cookies, setCookie] = useCookies(['user']);

    async function handleTest() {
        await test_sendNewEvent(cookies.user.pubkey)
    }

    return (
        <>
            <button className='darkgreen-btn' onClick={() => handleTest()} >test</button>
        </>
    );
}
export default Test