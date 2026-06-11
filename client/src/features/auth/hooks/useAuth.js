import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../authSlice"

export const useAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, loading } = useSelector((s) => s.auth)

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap()
            navigate('/login')
        } catch (err) {
            console.error(err)
        }
    }

    return {user, loading, logout:handleLogout}
}