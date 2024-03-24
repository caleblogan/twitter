import { FeedApi } from "@/api/feed";
import MainLayout from "@/components/MainLayoutSingle";
import PostsFeed, { UserPost } from "@/components/Posts";
import { Button } from "@/components/ui/button";
import { yearMonthFormat } from "@/lib/dates";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Profile {
    username: string;
    name: string;
    created_at: string;
    avatar_url?: string;
}

export default function UserFeedPage() {
    const { username } = useParams();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<UserPost[]>([]);

    useEffect(() => {
        console.log("RELOAD: username", username)
        setProfile({
            username: username ?? "", name: "SF Giants",
            created_at: "2021-09-01T00:00:00.000Z",
            avatar_url: "https://pbs.twimg.com/profile_images/1758356007938576385/wihR4F-B_400x400.jpg"
        })
        loadFeed()
    }, [username])

    async function loadFeed() {
        console.log("Load posts")
        const response = await FeedApi.homeFeed()
        console.log(response)
        setPosts(response.posts)
    }

    if (!profile) return <MainLayout className="border"></MainLayout>

    return <MainLayout className="border">
        <header className="stick h-[53px] p-2">
            <h1 className="text-xl font-bold ml-4">{profile.name}</h1>
            <h2 className="text-sm text-gray-500 ml-4 mt-[-2px]">95k posts</h2>
        </header>
        <section className="">
            <div className="relative">
                <img alt="" draggable="true" src="https://pbs.twimg.com/profile_banners/43024351/1708059730/600x200"
                    className="" />
                <img src={profile?.avatar_url} alt="avatar" className="w-32 rounded-lg absolute bottom-[-60px] ml-4 border-[4px] border-white" />
            </div>
            <div className="flex justify-end">
                <Button size="default" className="rounded-2xl mt-3 mr-4">follow</Button>
            </div>
            <div className="pl-6 mt-4">
                <h1 className="text-xl font-bold">{profile.name}</h1>
                <h2 className="text-sm text-gray-600">@{profile?.username}</h2>
                <p className="flex text-gray-500 mt-4 items-center gap-2"><CalendarIcon /> Joined {yearMonthFormat(profile.created_at)}</p>
            </div>
            <div className="flex gap-4 ml-6 mt-4">
                <div className="text-sm font-bold">258 <span className="text-gray-500 font-normal">following</span></div>
                <div className="text-sm font-bold">32k <span className="text-gray-500 font-normal">followers</span></div>
            </div>
        </section>

        <section className="mt-8 p-4">
            <h1 className="p-4 text-xl font-bold">Posts</h1>
            <PostsFeed posts={posts} user={profile} />
        </section>
    </MainLayout>
}
