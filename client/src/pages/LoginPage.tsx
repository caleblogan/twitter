import { getGithubLogin, loginAnon } from "@/api/users";
import MainLayout from "@/components/MainLayoutSingle";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { user, reloadUser } = useContext(UserContext)
    const navigate = useNavigate()
    async function handleGithubLogin() {
        const url = await getGithubLogin()
        window.location.assign(url)
    }
    async function handleAnonLogin() {
        console.log("Anon login")
        await loginAnon()
        reloadUser()
    }

    useEffect(() => {
        if (user) {
            console.log("User is logged in", user)
            navigate("/feed")
        }
    }, [user])

    return <MainLayout className="mt-8 p-2">
        <svg viewBox="0 0 29 24" aria-hidden="true" className="w-[45px] h-[45px]"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
        <h1 className="text-7xl font-bold mt-12">
            Happening<br />now
        </h1>
        <h2 className="text-3xl font-bold mt-10">Join today.</h2>
        <div className="max-w-[300px]">
            <Button onClick={handleGithubLogin} size="default" className="mt-8 w-full">Sign in with Github</Button>
            <p className="text-xs text-gray-600 mt-2">By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.</p>
            <p className="flex justify-center mt-4 text-md ">or</p>
            <Button onClick={handleAnonLogin} size="default" variant="outline" className="mt-4 w-full">Sign in with Anon</Button>
        </div>
    </MainLayout>
}

