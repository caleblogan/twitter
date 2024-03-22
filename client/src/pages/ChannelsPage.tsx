import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { ChannelCounts } from "../../../server/src/models/ChannelModel"
import { useParams } from "react-router-dom"
import { listChannels as listUsersChannels } from "@/api/users"
import { ChannelApi } from "@/api/channels"
import { Button } from "@/components/ui/button"


const placeHolder = "Search for channels"
export default function ChannelsPage() {
    const { workspaceId } = useParams()
    const [search, setSearch] = useState(placeHolder)
    const [touched, setTouched] = useState<boolean>(false)
    const [channels, setChannels] = useState<ChannelCounts[]>([])
    const [usersChannels, setUsersChannels] = useState<Set<string>>(new Set())
    const filteredChannels = search && search !== placeHolder
        ? channels.filter(ch => ch.name.toLowerCase().includes(search.toLowerCase()))
        : channels

    useEffect(() => {
        if (!workspaceId) return
        ChannelApi.list(workspaceId)
            .then(setChannels)

        listUsersChannels(workspaceId)
            .then(userChannels => {
                setUsersChannels(new Set(userChannels.map(ch => ch.id)))
            })
    }, [workspaceId])

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

    return <main style={{ "gridTemplateColumns": "auto" }}>
        <div
            className="workspace overflow-y-scroll text-gray-900 h-max flex flex-col pl-12 pr-12 pt-4" style={{ borderRadius: "6px", backgroundColor: "#F8F8F8" }}>
            <div className="mb-4">
                <h2 className="text-lg font-bold">All Channels</h2>
            </div>
            <div className="relative">
                <input
                    className="w-full h-10 border border-solid rounded-lg p-2 pl-10 mt-1 pr-10"
                    type="search" value={search} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
                <Search size={22} className="absolute left-2 top-[12px]" />
            </div>
            <div className="mt-4 rounded-lg bg-white border-gray-200 border">
                {filteredChannels.map(channel =>
                    <ChannelItem key={channel.id} channel={channel}
                        joined={usersChannels.has(channel.id)}
                    />
                )}
            </div>
        </div>
    </main>
}

// TODO: don't reload using window.location.reload()
function ChannelItem({ channel, joined }: { channel: ChannelCounts, joined: boolean }) {
    return <div className="flex justify-between p-4 border-b-gray-200 border-b items-center">
        <div className="flex flex-col">
            <h3 className="text-md font-bold"># {channel.name}</h3>
            <div className="flex justify-between">
                <p className="text-gray-500 text-sm">
                    {joined && <span className="text-emerald-600">joined  </span>} · {formatCounts(+channel.count)} · {channel.topic}
                </p>
            </div>
        </div>
        {!joined && <Button variant="success" size="sm"
            onClick={() => ChannelApi.join(channel.id).then(() => window.location.reload())}
        >Join</Button>}
    </div>
}

function formatCounts(count: number) {
    return count === 1
        ? "1 member"
        : `${count} members`
}