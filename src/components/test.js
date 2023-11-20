import React, { useState } from "react";
import { getWindowPubkey, test_sendNewEvent } from "./BadgeStrFunction";
import { useCookies } from 'react-cookie';

const Test = () => {
    const [cookies, setCookie] = useCookies(['user']);

    async function handleTest() {
        const win_pubkey = await getWindowPubkey()
        await test_sendNewEvent(win_pubkey)
    }

    return (
        <>
            <button className='darkgreen-btn' onClick={() => handleTest()} >test</button>
        </>
    );
}
export default Test