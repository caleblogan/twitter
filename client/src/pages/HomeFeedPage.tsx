import { FeedApi } from "@/api/feed";
import { PostsApi } from "@/api/posts";
import MainLayout from "@/components/MainLayoutSingle";
import PostsFeed, { UserPost } from "@/components/Posts";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context";
import { SendHorizonal } from "lucide-react";
import { useContext, useEffect, useState } from "react";


export default function HomeFeedPage() {
    const { user } = useContext(UserContext);
    const [posts, setPosts] = useState<UserPost[]>([]);

    useEffect(() => {
        loadFeed()
    }, [])

    if (!user) return <MainLayout className="border"></MainLayout>

    async function loadFeed() {
        console.log("Load posts")
        const response = await FeedApi.homeFeed()
        console.log(response)
        setPosts(response.posts)
    }

    return <MainLayout className="border border-t-0">
        <header className="stick h-[53px] p-4 mt-4">
            <CreatePost onCreate={loadFeed} />
        </header>
        <section className="mt-8 p-4">
            <h1 className="p-4 text-xl font-bold">Posts</h1>
            <PostsFeed posts={posts} user={user} />
        </section>
    </MainLayout>
}

function CreatePost({ onCreate }: { onCreate: () => void }) {
    const [value, setValue] = useState("")
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!value) return
        console.log("Submit post")
        // TODO: add error handling / validation handling
        await PostsApi.create({ text: value })
        setValue("")
        onCreate()
    }
    return <form onSubmit={handleSubmit} className="relative">
        <input type="text" placeholder="New post"
            value={value} onChange={e => setValue(e.target.value)}
            className="w-full h-full rounded-full p-3 pl-6 pr-20 bg-slate-100" />
        <Button variant="ghost" className="absolute top-1/2 right-3 transform -translate-y-1/2 hover:bg-slate-200 hover:rounded-full" >
            <SendHorizonal className="w-6 h-6 text-gray-500" />
        </Button>
    </form>
}

