import defaultPhoto from '../../assets/images/no-profile-picture.svg'
import { useMutation, useQuery } from '@apollo/client';
import { ADD_FRIEND } from '../../utils/mutations';
import { QUERY_FRIENDS } from '../../utils/queries'

const ProfileUserInfo = ({ data }) => {
    let averageWPM;
    if (data.scoresByUser.length !== 0) {
        let scoresArr = []
        for (let i = 0; i < data.scoresByUser.length; i++) {
            scoresArr.push(data.scoresByUser[i].wpm)
        }
        const average = (array) => scoresArr.reduce((a, b) => a + b) / scoresArr.length;
        averageWPM = average(scoresArr);
    }

    console.log(data);
    return (
        <section>
            <div>
                {data.user.profilePic && <img src={`../${data.user.profilePic}`} alt='' width='100' height='100'></img>}
                {!data.user.profilePic && <img src={defaultPhoto} alt='' width='100' height='100'></img>}
            </div>
            <div>
                <h3>{data.user.username}</h3>
            </div>
            <div>
                <p>
                    {data.user.bio}
                </p>
            </div>
            <div>
                {data.scoresByUser[0] && <p>Highest WPM: {data.scoresByUser[0].wpm}</p>}
                {!data.scoresByUser[0] && <p>This user has not completed any games</p>}
                {data.scoresByUser[0] && <p>Average WPM: {averageWPM} </p>}
                {data.scoresByUser[0] && <p>Games Played: {data.scoresByUser.length} </p>}
            </div>
            <div>
                {data.user.location && <p>Location: {data.user.location} </p>}
                {!data.user.location && <p>No location set</p>}
            </div>
        </section >
    )
}

export default ProfileUserInfo;