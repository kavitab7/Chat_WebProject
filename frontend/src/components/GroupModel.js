import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAuth } from '../context/auth';
import { useChat } from '../context/chat';
import '../styles/groupmodel.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const GroupModel = () => {
    const { chats, setChats } = useChat();
    const [auth] = useAuth()
    const [open, setOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const getAllUsers = async () => {
        try {
            const { data } = await axios.get('/api/user/all-users');
            if (data.success) {
                setAllUsers(data.users);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleUserSelect = (user) => {
        if (!selectedUsers.some((selectedUser) => selectedUser._id === user._id)) {
            setSelectedUsers([...selectedUsers, user]);
            setAllUsers(allUsers.filter((u) => u._id !== user._id));
        }
    };

    const handleRemoveUser = (userId) => {
        setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
    };

    const handleCreateGroup = async () => {
        if (selectedUsers.length > 0 && groupName.trim() !== '') {
            try {

                const { data } = await axios.post('/api/chat/group', {
                    name: groupName, users: JSON.stringify(selectedUsers.map((u) => u._id))
                });
                setChats([...chats, data?.fullGroupChat]);
                handleClose();
            } catch (error) {
                console.error('Error creating group:', error);
            }
        }
    };
    useEffect(() => {
        if (auth.user) getAllUsers();
    }, [auth.user]);


    return (
        <div>
            <Button onClick={handleOpen}>Create Group</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Create Group
                        </Typography>
                        <div>
                            <input
                                className='group-name-input'
                                type="text"
                                placeholder="Enter group name"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </div>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', height: '200px', overflow: 'scroll' }}>
                                {selectedUsers.map((user) => (
                                    <div key={user._id} style={{ display: 'flex', alignItems: 'center' }}>
                                        <img
                                            src={`/api/user/profile-photo/${user._id}`}
                                            className="avatar"
                                            alt={user.username}
                                        />
                                        <span className="group-user-name">{user.username}</span>
                                        <Button onClick={() => handleRemoveUser(user._id)}>X</Button>
                                    </div>
                                ))}
                                {allUsers.map((user) => (
                                    <Button key={user._id} onClick={() => handleUserSelect(user)}>
                                        <img src={`/api/user/profile-photo/${user._id}`} className="avatar" alt={user.username} />
                                        <span className="group-user-name">{user.username}</span>
                                    </Button>
                                ))}
                            </div>
                        </Typography>
                        <Button variant="contained" onClick={handleCreateGroup}>
                            Create
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default GroupModel