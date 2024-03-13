import React, { useState } from 'react'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import '../styles/login.css'
import { useChat } from '../context/chat';

const Login = () => {
    const [auth, setAuth] = useAuth();
    const { setUser } = useChat()
    const [input, setInput] = useState({
        email: '', password: ''
    })
    const navigate = useNavigate()

    const handleChange = (e) => {
        setInput((pre) => ({
            ...pre,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/user/login', {
                email: input.email, password: input.password
            })
            if (data?.success) {
                setUser(data?.user)
                setAuth({
                    user: data?.user,
                    token: data?.token
                })
                localStorage.setItem('auth', JSON.stringify(data));
                navigate('/chats')
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <div className="login">
                <h3 className="mb-3" >LOGIN</h3>
                <form onSubmit={handleSubmit}>
                    <div className="login-info">
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input type="email" value={input.email} onChange={handleChange} className="form-control" name='email' id="exampleInputEmail1" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" value={input.password} onChange={handleChange} className="form-control" name='password' />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login