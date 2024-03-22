import Header from "@/components/Header/Header";
import "./Client.css";
import { Home, MessagesSquare, Bell, Bookmark, MoreHorizontal, Plus } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserContext } from "@/context";
import { getGithubLogin, loginAnon } from "@/api/users";
import WorkspaceModel from "../../../../server/src/models/WorspaceModel";
import { WorkspaceApi, listWorkspaces } from "@/api/workspaces";
import { DialogTrigger } from "@radix-ui/react-dialog";

export default function Client() {
    return (
        <div className="client">
            <Header />
            <Login />
            <div className="content">
                <Rail />
                <Outlet />
            </div>
        </div>
    )
}

function Login() {
    const { user, reloadUser } = useContext(UserContext)
    async function handleGithubLogin() {
        const url = await getGithubLogin()
        window.location.assign(url)
    }
    async function handleAnonLogin() {
        console.log("Anon login")
        await loginAnon()
        reloadUser()
    }
    return <Dialog open={!user} onOpenChange={() => { }} >
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Please sign in</DialogTitle>
                <DialogDescription>
                    Please sign in to continue to your workspace
                </DialogDescription>
                <Button className="" onClick={handleGithubLogin}>Sign in with GitHub</Button>
                <Separator />
                <Button variant="outline" onClick={handleAnonLogin}>Sign in with Anon account</Button>
            </DialogHeader>
        </DialogContent>
    </Dialog>
}


function Rail() {
    return <div className="rail">
        <div className="flex flex-col">
            <WorkspaceLink />
            <RailLink to="" icon={<Home size={20} className="block m-auto" />} name="Home" end />
            <RailLink to="dms" icon={<MessagesSquare size={20} className="block m-auto" />} name="DMs" />
            <RailLink to="activity" icon={<Bell size={20} className="block m-auto" />} name="Activity" />
            <RailLink to="later" icon={<Bookmark size={20} className="block m-auto" />} name="Later" />
            <div className="mb-4">
                <button className={`hover:bg-gray-400 hover:bg-opacity-35 rounded-md w-[36px] h-[36px]`}>
                    <MoreHorizontal size={20} className="block m-auto" style={{}} />
                </button>
                <div className="text-[11px] font-thin text-center">More</div>
            </div>
        </div>
    </div>
}

function RailLink({ to, icon, name, end }: { to: string, icon: React.JSX.Element, name: string, end?: boolean }) {

    return <div className="mb-4">
        <NavLink to={to} end={end}>
            {({ isActive }) => (
                <>
                    <button className={`hover:bg-gray-400 hover:bg-opacity-35 rounded-md w-[36px] h-[36px] ${isActive && ("bg-opacity-35 bg-gray-400")}`}>
                        {icon}
                    </button>
                    <div className="text-[11px] font-thin text-center">{name}</div>
                </>
            )}
        </NavLink>
    </div>
}

// TODO: use url to get active link
function WorkspaceLink() {
    const [workspaceOpen, setWorkspaceOpen] = useState(false)
    const { user } = useContext(UserContext)
    const [workspaces, setWorkspaces] = useState<WorkspaceModel[]>([])
    useEffect(() => {
        loadWorkSpaces()
    }, [user])

    function loadWorkSpaces() {
        listWorkspaces()
            .then((data) => {
                setWorkspaces(data)
            })
    }

    if (!workspaces?.length) return null
    return <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={`text-xl mb-3 bg-gray-500 hover:bg-opacity-35 rounded-md w-[36px] h-[36px]`}>
                    {workspaces[0]?.name[0].toUpperCase()}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="ml-2 min-w-[300px]">
                {
                    workspaces.map(workspace => (
                        <Link to={`/client/${workspace.id}`} key={workspace.id}>
                            <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                                <h3>{workspace.name}</h3>
                                <p className="text-gray-600">{workspace.id}</p>
                            </DropdownMenuItem>
                        </Link>
                    ))
                }
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-md text-gray-500 cursor-pointer" onClick={() => setWorkspaceOpen(true)}>
                    <Plus size={24} className="mr-4" /> Create a workspace
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
        <CreateWorkspaceDialogFrom open={workspaceOpen} onClose={() => setWorkspaceOpen(false)} onCreate={loadWorkSpaces} />
    </>
}

function CreateWorkspaceDialogFrom({ open, onClose, onCreate }: { open: boolean, onClose: () => void, onCreate: () => void }) {
    const [name, setName] = useState("")
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log("Submit")
        await WorkspaceApi.create(name)
        onClose()
        onCreate()
    }
    return <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger asChild>
        </DialogTrigger>
        <DialogContent showCloseIcon>
            <DialogHeader>
                <DialogTitle>Create a workspace</DialogTitle>
                <DialogDescription>
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <label htmlFor="workspace-name" className="mt-4 block">
                    <span className="text-gray-900">Name</span>
                    <input className="w-full p-2 border border-gray-300 rounded-md mt-2"
                        type="text" id="workspace-name" placeholder="Workspace name"
                        value={name} onChange={e => setName(e.target.value)} />
                </label>
                <div className="flex justify-end">
                    <Button
                        disabled={!name}
                        variant="success" className="mt-4">Create</Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
}