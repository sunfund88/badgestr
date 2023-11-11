import ProfileBadgeItem from "./ProfileBadgeItem";


const ProfileBadges = ({ badgesObj, diffObj }) => {
    return (
        <div className="badges">
            {(badgesObj.length > 0)
                ? (
                    <>
                        <h3>Accept Badges</h3>
                        <div className="badges-container">
                            <div className="badges-list">
                                {badgesObj.map((b, i) => (
                                    <ProfileBadgeItem key={i} badgeItem={b} type={true} />
                                ))}
                            </div>
                        </div>
                    </>
                )
                : (<></>)}
            {(diffObj.length > 0)
                ? (
                    <>
                        <h3>Unaccept Badges</h3>
                        <div className="badges-container">
                            <div className="badges-list">
                                {diffObj.map((b, i) => (
                                    <ProfileBadgeItem key={i} badgeItem={b} type={false} />
                                ))}
                            </div>
                        </div>
                    </>
                )
                : (<></>)}
        </div>
    );
}

export default ProfileBadges