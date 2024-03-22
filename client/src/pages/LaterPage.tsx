import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, CircleIcon, Filter, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function LaterPage() {
    return <main>
        <aside className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="ml-2 text-lg">Later</h2>
                <div className="">
                    <Button variant="ghost" className="text-md p-2 mr-0"><b><Filter className="inline-block mt-[-2px]" size={16} /> </b></Button>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild><Button variant="ghost" className="text-md p-2 mr-0"><b><Plus className="inline-block mt-[-2px]" size={20} /> </b></Button></TooltipTrigger>
                            <TooltipContent className="">
                                <p className="">New reminder</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <Tabs defaultValue="in-progress" className="flex flex-col">
                <TabsList>
                    <TabsTrigger value="in-progress">In progress</TabsTrigger>
                    <TabsTrigger value="archived">Archived</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="in-progress" className="flex flex-col items-center">
                    <h2 className="text-xl mt-12">You made a lot of progress</h2>
                    <p className="mt-2 mb-4 text-sm text-gray-100">You checked everything off</p>
                    <Button variant="default" className="">Create Reminder</Button>
                </TabsContent>
                <TabsContent value="archived">
                    <p className="text-md font-light p-4">Mentions... Empty</p>
                    <Button variant="default" className="w-full">Add people to Slack</Button>
                </TabsContent>
                <TabsContent value="completed">
                    <p className="text-md font-light p-4">Threads... Empty</p>
                    <Button variant="default" className="w-full">Add people to Slack</Button>
                </TabsContent>
            </Tabs>
        </aside>

        <div className="workspace text-gray-900 h-max flex flex-col">
            <div className="border-b border-solid p-3">
                <Button variant="ghost" className="text-md mr-2"><b>clogan202 <ChevronDown className="inline-block mt-[-2px]" size={16} /> </b></Button>
            </div>
            <div className="flex-1 relative overflow-auto">
                <div className="border-b border-solid p-6">
                    <div className="flex mb-4">
                        <img src="https://ca.slack-edge.com/T6BEC06K1-U6AFAQ4SH-g097b266a115-192" alt="user profile picture"
                            className="w-28 h-28 rounded-md border border-solid border-gray-300 mr-4"
                        />
                        <h2 className="mt-10 text-lg mb-2 font-bold">clogan202 (you)
                            <CircleIcon className="inline-block ml-2" size={10} fill="#3DAA7C" color="#3DAA7C" />
                        </h2>
                    </div>
                    <p>This is your space. Draft messages, list your to-dos, or keep links and files handy. You can also talk to yourself here, but please bear in mind you’ll have to supply both sides of the conversation.</p>
                    <Button variant="outline" className="mt-4 mr-2">Edit Profile</Button>
                    <Button variant="outline" className="mt-4">Upload Profile Photo</Button>
                </div>
                <div className="message-container p-6 relative">

                </div>
            </div>
            <div className="flex bg-white relative">
                <textarea className="flex-grow h-36 p-2 m-4 border rounded-md border-solid resize-none" placeholder="Message #general"></textarea>
            </div>
        </div>
    </main>
}
