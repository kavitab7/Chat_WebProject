import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [photo, setPhoto] = useState("");
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = new FormData();
            userData.append("username", username);
            userData.append("email", email);
            userData.append("password", password);
            userData.append("photo", photo);
            const { data } = await axios.post('/api/user/register', userData);
            if (data.success) {
                navigate('/login')
            } else {
                console.log(data.error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div><div className="login-page">
            <div className="login">
                <h3 className="mb-3" >Register</h3>
                <form onSubmit={handleSubmit} >
                    <div className="login-info">
                        <div className="mb-3">
                            <label className="form-label file-upload-label">
                                {photo ? photo.name : "Upload photo"}
                                <input type="file" name='photo' accept='image/*'
                                    onChange={(e) => setPhoto(e.target.files[0])} hidden />
                            </label>
                        </div>
                        <div className="mb-3 uploaded-photo">
                            {photo && (
                                <img src={URL.createObjectURL(photo)} alt="Profile_photo" />
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" id="exampleInputEmail1" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    )
}

export default SignUp