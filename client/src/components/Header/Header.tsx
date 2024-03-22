import React, { useContext, useState } from "react"
import "./Header.css"
import { Search } from "lucide-react"
import { UserContext } from "@/context"
import { Button } from "../ui/button"
import { logout } from "@/api/users"

const placeHolder = "Search"
export default function Header() {
    const [search, setSearch] = useState<string>(placeHolder)
    const [touched, setTouched] = useState<boolean>(false)
    const { user, reloadUser } = useContext(UserContext)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!touched) setTouched(true)
        setSearch(e.target.value)
    }
    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
        if (e.target.value === placeHolder) setSearch("")
    }
    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        if (e.target.value === "") setSearch(placeHolder)
    }
    async function handleLogout() {
        await logout()
        reloadUser()
    }
    return (
        <header className="relative">
            <div className="relative">
                <input type="search" value={search} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
                <Search size={12} className="absolute left-2 top-[7px]" />
            </div>
            {user && <Button onClick={handleLogout}
                variant="ghost"
                className="absolute right-2 top-1 text-sm" size={"sm"}
            >logout</Button>}
        </header>
    )
}