const ProfileBadges = ({ badgesObj: badgesObj }) => {
    return (
        <div className="badges">
            <h3>Accepted Badges</h3>
            <div className="badges-container">
                <div className="badges-list">
                    <ul>
                        {badgesObj.map((b, i) => (
                            <li key={i}>
                                <img className="image" src={b.thumb} width="120" height="120" alt={b.name}
                                    onError={event => {
                                        event.target.src = "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png"
                                        event.onerror = null
                                    }} />{b.name}

                                <div className="text"></div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <h3>New Badges</h3>

        </div>
    );
}

export default ProfileBadges