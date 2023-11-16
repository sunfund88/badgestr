import { getUserName } from '../BadgeStrFunction';

const BadgeUserItem = ({ user }) => {
    const default_img = "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png"
    let img

    if (user[1]?.picture) {
        img = user[1]?.picture
    } else {
        img = default_img
    }

    return (
        <div className='b-badge-item'>
            <img
                src={img}
                alt={user[1]?.name}
                onError={event => {
                    event.target.src = default_img
                    event.onerror = null
                }} />
            <div className='b-badge-item-name'>{getUserName(user[1])}
            </div>
        </div>

    );
}

export default BadgeUserItem