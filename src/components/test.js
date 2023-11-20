import React, { useState } from "react";
import { test_sendNewEvent } from "./BadgeStrFunction";

const Test = () => {
    async function handleTest() {
        await test_sendNewEvent()
    }

    return (
        <>

            <button className='darkgreen-btn' onClick={() => handleTest()} >test</button>
        </>
    );
}
export default Test