import { useState, useContext, useEffect, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: '',
    })
    const setAuthorizationHeader = () => {
        const storedAuthData = JSON.parse(localStorage.getItem('auth'));
        if (storedAuthData && storedAuthData.token) {
            axios.defaults.headers.common['Authorization'] = storedAuthData?.token
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };
    useEffect(() => {
        setAuthorizationHeader();
        const data = localStorage.getItem('auth');
        if (data) {
            const parseData = JSON.parse(data);
            setAuth({
                ...auth,
                user: parseData.user,
                token: parseData.token,
            })

        }
    }, [auth?.token])

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider }