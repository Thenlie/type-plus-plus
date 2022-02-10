import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';

import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';

import UserInfo from '../components/UserInfo';
// import Achievements from '../components/Achievements';
// import Progress from '../components/Progress'
import EditModal from '../components/EditModal';

// Modal Styles, remove later for custom styles
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

const Dashboard = () => {
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalBio, setModalBio] = useState('');
    function openModal() {
        setIsOpen(true);
    }
    function afterOpenModal() {
        subtitle.style.color = '#f00';
    }
    function closeModal() {
        setIsOpen(false);
    }
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');
    const { username: userParam } = useParams();
    const { loading, data } = useQuery(QUERY_ME);
    console.log(data);
    const user = data?.me || data?.user || {};

    if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
        return <Navigate to="/dashboard" />;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user?.username) {
        return <h4 className="flex-grow">Must be logged in</h4>;
    }

    return (
        <main className="flex-grow">
            <UserInfo
                data={data}
                modalBio={modalBio}
                setModalBio={setModalBio}
            />
            <div>
                <button onClick={openModal}>Edit Profile</button>
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
                        Edit Profile
                    </h2>

                    <EditModal
                        data={data}
                        modalBio={modalBio}
                        setModalBio={setModalBio}
                        image={image}
                        setImage={setImage}
                        url={url}
                        setUrl={setUrl}
                    />
                    <button onClick={closeModal}>Done</button>
                </Modal>
            </div>
        </main>
    );
};

export default Dashboard;
