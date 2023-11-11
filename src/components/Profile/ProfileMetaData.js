import React, { useState, useEffect, useRef } from 'react';

const ProfileMetaData = ({ profile: profile }) => {
    // const [isLoading, setIsLoading] = useState(true);
    // {
    //     "picture": "https://nostr.build/i/nostr.build_15a5e334e4c30de7ee9055eaaf9547c435d014cbb1a82fd7bcb4387cc94ff4d4.png",
    //     "display_name": "Suntoshi⚡️",
    //     "lud16": "suntoshi@getalby.com",
    //     "nip05": "suntoshi@siamstr.com",
    //     "banner": "https://cdn.nostr.build/i/2fc13984e2a2b4ec0dad1442ad2e404ca6d24c55c7375185e544950fe6cd3550.jpg",
    //     "created_at": 1694061924,
    //     "nip05valid": true,
    //     "displayName": "Suntoshi⚡️",
    //     "pubkey": "50e8ee3108cdfde4adefe93093cd38bd8692f59f250d3ee4294ef46dc102f370",
    //     "npub": "npub12r5wuvggeh77ft00aycf8nfchkrf9avly5xnaepffm6xmsgz7dcqrvm6se",
    //     "name": "suntoshi",
    //     "about": "🟠⚡Bitcoin is real freedom."
    //   }
    return (
        <>
            <div className="header">
                <div className="header-banner">
                    <img src={profile?.banner}
                        width="800"
                        height="266"
                        alt={profile?.name}
                    // onLoadStart={() => setIsLoading(true)}
                    // onLoad={() => setIsLoading(false)}>
                    />
                </div>
                <div className="header-picture">
                    <img src={profile?.picture} width="120" height="120" alt={profile?.name}></img>
                </div>
                <div className="header-name">
                    <h1>{profile?.name}</h1>
                    <h4>{profile?.npub}</h4>
                </div>

            </div>
            <div className="header-address">
                <ul>
                    <li>🟣 {profile?.nip05}</li>
                    <li>⚡ {profile?.lud16}</li>
                    {/* <li></li> */}
                </ul>
            </div>
            <div className="header-about">
                {profile?.about}
            </div>
        </>
        // !isLoading
        // ? ()
        // : (<></>)
    );
}

export default ProfileMetaData