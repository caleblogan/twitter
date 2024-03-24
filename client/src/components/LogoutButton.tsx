import { UsersApi } from "@/api/users"
import { useNavigate } from "react-router-dom"
import { twMerge } from "tailwind-merge"
import { Button } from "./ui/button"
import { useContext } from "react"
import { UserContext } from "@/context"

export default function LogoutButton({ className }: { className?: string }) {
    const { user, reloadUser } = useContext(UserContext)
    const navigate = useNavigate()
    async function logout() {
        await UsersApi.logout()
        await reloadUser()
        navigate("/")
    }
    if (!user) return null
    return <Button size="sm" variant="secondary" onClick={logout}
        className={twMerge("rounded-2xl", className)}>
        Logout
    </Button>
}