const ProfileBadges = ({ badgesObj, diffObj }) => {
    return (
        <div className="badges">
            {(badgesObj.length > 0)
                ? (<h3>Accepted Badges</h3>)
                : (<></>)}
            <div className="badges-container">
                <div className="badges-list">
                    <ul>
                        {badgesObj.map((b, i) => (
                            <li key={i}>
                                <img className="image" src={b.thumb} width="120" height="120" title={b.name} alt={b.name}
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
            {(diffObj.length > 0)
                ? (<h3>Unaccepted Badges</h3>)
                : (<></>)}
            <div className="badges-container">
                <div className="badges-list">
                    <ul>
                        {diffObj.map((b, i) => (
                            <li key={i}>
                                <img className="image" src={b.thumb} width="120" height="120" title={b.name} alt={b.name}
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
        </div>
    );
}

export default ProfileBadges