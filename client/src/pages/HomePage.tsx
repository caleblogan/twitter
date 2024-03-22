import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible"
import { ChevronDown, ChevronRight, Filter, MailPlus, MessageCircleMore, Plus, Rocket, SendHorizonal, UserRoundPlus } from "lucide-react"
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate, useParams, useLocation, NavLink, Link } from "react-router-dom"
import { UserContext } from "@/context"
import ChannelModel from "../../../server/src/models/ChannelModel"
import { listChannels } from "@/api/users"
import WorkspaceModel from "../../../server/src/models/WorspaceModel"
import MessageModel from "../../../server/src/models/MessageModel"
import { getWorkpace } from "@/api/workspaces"
import { ChannelApi, listMessages } from "@/api/channels"
import { UserModel } from "../../../server/src/models/UserModel"
import InputMaxLength from "@/components/inputs/InputMaxLength"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { WebsocketApi, useWebSocket } from "@/hooks/websockets"


export default function HomePage() {
    const { channelId, workspaceId } = useParams()
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const [channels, setChannels] = useState<ChannelModel[]>([])
    const [workspace, setWorkspace] = useState<WorkspaceModel | null>(null)
    const [messages, setMessages] = useState<(MessageModel & UserModel)[]>([])
    const { status, WebsockApi } = useWebSocket("ws://localhost:3000", handleMessage);

    function handleMessage({ action, data }: { action: string, data?: any }) {
        console.log("Message from server action=", action, "data=", data);
        if (action === "channels.connect") {
            console.log("CONNECTED TO CHANNEL", data.channelId)
        } else if (action === "messages.new") {
            console.log("NEW MESSAGE", data)
            setMessages(prev => [...prev, data])
        } else if (action === "channels.leave") {
            console.log("LEFT CHANNEL", data.channelId)
        }
    }

    useEffect(() => {
        if (status === "Open" && channelId) {
            WebsockApi.Channels.connect(channelId)
        }
    }, [status, channelId])

    const channel = channels.find(c => c.id === channelId)

    useEffect(() => {
        if (!channelId && channels.length > 0) {
            navigate(`${pathname}/${channels[0].id}`)
        }
    }, [channelId, channels])

    useEffect(() => {
        if (!workspaceId) return
        loadChannels()
        getWorkpace(workspaceId).then(workspace => {
            setWorkspace(workspace)
        })
    }, [workspaceId])

    useEffect(() => {
        loadMessages()
    }, [channelId])

    function loadMessages() {
        if (!channelId) return
        listMessages(channelId).then(messages => {
            setMessages(messages)
        })
    }
    function loadChannels() {
        if (!workspaceId) return
        listChannels(workspaceId).then(channels => {
            setChannels(channels)
        })
    }

    return <main>
        <Sidebar
            channels={channels}
            user={user}
            workspace={workspace}
            currentChannelId={channelId}
            onAddChannel={loadChannels}
        />
        <MainContent channel={channel} messages={messages} loadMessages={loadMessages} websocketApi={WebsockApi} />
    </main>
}

type SidebarProps = {
    user: UserModel | null, workspace: WorkspaceModel | null, channels: ChannelModel[], currentChannelId?: string
    onAddChannel: () => void
}
function Sidebar({ user, workspace, channels, currentChannelId, onAddChannel }: SidebarProps) {
    return <aside className="flex flex-col text-gray-300">
        <div className="flex justify-between mb-4">
            <Button variant="ghost" className="text-md mr-2"><b>{workspace?.name}<ChevronDown className="inline-block mt-[-2px]" size={16} /> </b></Button>
            <div className="">
                <Button variant="ghost" className="text-md p-2 mr-0"><b><Filter className="inline-block mt-[-2px]" size={16} /> </b></Button>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild><Button variant="ghost" className="text-md p-2 mr-0"><b><MailPlus className="inline-block mt-[-2px]" size={16} /> </b></Button></TooltipTrigger>
                        <TooltipContent className="">
                            <p className="">new message</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>

        <Button variant="default" className="text-sm mb-4"><Rocket className="inline-block mr-2 " size={16} />Upgrade Plan</Button>
        <Button variant="ghost" className="text-sm justify-start"><MessageCircleMore className="inline-block mr-2" size={18} />Threads</Button>
        <Button variant="ghost" className="text-sm justify-start mb-6"><SendHorizonal className="inline-block mr-2" size={18} />Drafts & sent</Button>

        <SideDropdown trigger="Channels">
            <ul>
                {channels.map(channel => <ChannelLink key={channel.id} channel={channel} selectedChannelId={currentChannelId} />)}
                {/* <li><AddChannelDialog workspaceId={workspace?.id} onAdd={onAddChannel} /></li> */}
                <li><AddChannel workspaceId={workspace?.id} onAdd={onAddChannel} /></li>
            </ul>
        </SideDropdown>
        <SideDropdown trigger="Direct messages">
            <ul>
                {user && <ChannelLink channel={{ id: "clogan202", name: "clogan202" } as any} selectedChannelId={currentChannelId} />}
                <li><AddDMDialog /></li>
            </ul>
        </SideDropdown>
        <SideDropdown trigger="Apps" defaultOpen={false}>
            <ul>
                <ChannelLink channel={{ id: "slackbot", name: "Slackbot" } as any} selectedChannelId={currentChannelId} />
                <ChannelLink channel={{ id: "pybot", name: "Pybot" } as any} selectedChannelId={currentChannelId} />
                <ChannelLink channel={{ id: "rtfm", name: "Rtfm" } as any} selectedChannelId={currentChannelId} />
            </ul>
        </SideDropdown>

    </aside>
}

function AddChannel({ workspaceId, onAdd }: { workspaceId?: string, onAdd: () => void }) {
    const [openAddChannel, setOpenAddChannel] = useState(false)
    return <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full h-7 justify-start"><Plus size={14} className="mr-2 border-none" />Add channel</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0 border-none pt-3 pb-3">
                <DropdownMenuItem className="cursor-pointer focus:bg-[#1264A3] focus:text-white m-0 pl-6 pr-6 rounded-none"
                    onClick={() => setOpenAddChannel(true)}
                >
                    Create a new channel
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer focus:bg-[#1264A3] focus:text-white m-0 pl-6 pr-6 rounded-none" >
                    <Link to={`/client/${workspaceId}/channels`}>Browse channels</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <AddChannelDialog workspaceId={workspaceId} onAdd={onAdd} open={openAddChannel} onClose={() => setOpenAddChannel(false)} />
    </>
}

type AddChannelDialogProps = {
    workspaceId?: string, onAdd: () => void, open: boolean, onClose: () => void
}
function AddChannelDialog({ workspaceId, onAdd, open, onClose }: AddChannelDialogProps) {
    const [name, setName] = useState("")
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!workspaceId) return
        if (!name) return
        try {
            await ChannelApi.create(workspaceId, name)
            onAdd()
            onClose()
            setName("")
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }
    return <Dialog onOpenChange={onClose} open={open}>
        <DialogTrigger asChild>
            {/* <Button variant="ghost" className="w-full h-7 justify-start"><Plus size={14} className="mr-2" />Add channel</Button> */}
        </DialogTrigger>
        <DialogContent showCloseIcon>
            <DialogHeader>
                <DialogTitle className="text-xl">Create a channel</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="w-full">
                    <label>Name</label>
                    <InputMaxLength max={80} value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="flex justify-end">
                    <Button variant="success" className="mt-3">Submit</Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
}

function AddDMDialog() {
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="ghost" className="w-full h-7 justify-start"><Plus size={14} className="mr-2" />Add coworkers</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Invite people to Boogl</DialogTitle>
            </DialogHeader>
            <form onSubmit={e => e.preventDefault()}>
                <div className="flex flex-col">
                    <label>To:</label>
                    <input type="email" className="w-full h-23 border border-solid rounded-md p-2" placeholder="name@example.com" />
                    <DialogClose asChild>
                        <div className="flex justify-end">
                            <Button onClick={() => {
                                console.log("sending")
                            }} variant="success" className="mt-3">Submit</Button>
                        </div>
                    </DialogClose>
                </div>
            </form>
        </DialogContent>
    </Dialog>
}

type MainContentProps = {
    channel?: ChannelModel, messages: (MessageModel & UserModel)[], loadMessages: () => void,
    websocketApi: WebsocketApi
}
function MainContent({ channel, messages, loadMessages, websocketApi }: MainContentProps) {
    const messageContaineRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        messageContaineRef.current?.scrollTo({ top: messageContaineRef.current?.scrollHeight, behavior: "smooth" })
    }, [channel, messages])

    if (!channel) { return null }

    return <div className="workspace text-gray-900 h-max flex flex-col">
        <div className="border-b border-solid p-3">
            <Button variant="ghost" className="text-md mr-2"><b># {channel.name}<ChevronDown className="inline-block mt-[-2px]" size={16} /> </b></Button>
            <span className="text-sm font-thin text-gray-500">{channel.topic}</span>
        </div>
        <div className="flex-1 relative overflow-auto" ref={messageContaineRef}>
            <div className="border-b border-solid p-6">
                <h2 className="mt-10 text-2xl mb-2"><b># {channel.name}</b></h2>
                <p>{channel.description} (edit)</p>
                <Button variant="outline" className="mt-4"><UserRoundPlus size={14} className="mr-2" />Add coworkers</Button>
            </div>
            <div className="message-container p-6 relative" >
                {
                    messages?.length
                        ? messages.map((message, i) => <Message key={i} message={message} />)
                        : <p className="text-center text-gray-500">No messages yet</p>
                }
            </div>
        </div>
        <NewMessageBox channel={channel} onAdd={() => loadMessages()} websocketApi={websocketApi} />
    </div>
}

function NewMessageBox({ channel, websocketApi }: { channel?: ChannelModel, onAdd: (message: string) => void, websocketApi: WebsocketApi }) {
    const [message, setMessage] = useState("")
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    async function handleSubmit() {
        if (!channel?.id) return null
        websocketApi.Messaages.send(message)
        setMessage("")
        textAreaRef.current?.focus()
    }
    return <div className="flex bg-white relative">
        <textarea
            ref={textAreaRef}
            onChange={e => setMessage(e.target.value)}
            value={message}
            className="flex-grow h-36 p-2 m-4 border rounded-md border-solid resize-none" placeholder={`Message #${channel?.name}`}></textarea>
        <Button
            disabled={!message}
            onClick={handleSubmit}
            size="sm" variant="success" className="absolute right-6 bottom-6">Send</Button>
    </div>
}

function Message({ message }: { message: MessageModel & UserModel }) {
    return <div className="flex mb-2">
        <Avatar className="mt-2 mr-2 rounded-md">
            <AvatarImage src={message.avatar_url} />
            <AvatarFallback>{`${message.username} avatar image`}</AvatarFallback>
        </Avatar>
        <div>
            <h3><b>{message.username}</b> <span className="text-sm">{formatMessageDate(message.created_at)}</span></h3>
            <p className="text-gray-800">{message.text}</p>
        </div>
    </div>
}

function SideDropdown({ trigger, children, defaultOpen = true }: { trigger: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen)
    return <Collapsible open={open} onOpenChange={setOpen} className="flex flex-col mb-2">
        <CollapsibleTrigger asChild>
            <Button variant="ghost" className="text-sm block text-left">
                {open ? <ChevronDown className="inline-block mr-2" size={16} /> : <ChevronRight className="inline-block mr-2" size={16} />}
                {trigger}</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
            {children}
        </CollapsibleContent>
    </Collapsible>
}

function ChannelLink(props: { channel: ChannelModel, selectedChannelId?: string }) {
    return <NavLink to={(props.selectedChannelId ? "../" : "") + props.channel.id}>
        {({ isActive }) => (
            <li><Button variant="ghost" className={`pl-5 h-7 w-full justify-start ${isActive && "bg-[#5F2565]"}`}># {props.channel.name}</Button></li>
        )}
    </NavLink>
}

function formatMessageDate(date: string) {
    const d = new Date(date)
    return d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}