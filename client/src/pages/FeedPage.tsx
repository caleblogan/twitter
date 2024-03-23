import MainLayout from "@/components/MainLayoutSingle";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface Profile {
    username: string;
    name: string;
    created_at: string;
    avatar?: string;
}

export default function Feed() {
    const { username } = useParams();
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        console.log("RELOAD: username", username)
        setProfile({
            username: username ?? "", name: "SF Giants",
            created_at: "2021-09-01T00:00:00.000Z",
            avatar: "https://pbs.twimg.com/profile_images/1758356007938576385/wihR4F-B_400x400.jpg"
        })
    }, [username])

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
                <img src={profile?.avatar} alt="avatar" className="w-32 rounded-lg absolute bottom-[-60px] ml-4 border-[4px] border-white" />
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
            <Posts username={profile.username} />
        </section>
    </MainLayout>
}

type Post = {
    id: string
    username: string;
    text: string
    created_at: string
}

type User = {
    avatar?: string
    name: string
}

type UserPost = Post & User

function Posts({ username }: { username: string }) {
    const [posts, setPosts] = useState<UserPost[]>([]);

    useEffect(() => {
        console.log("RELOAD: posts", username)
        setPosts([
            {
                id: "1",
                username,
                name: "SF Giants",
                text: "post 1",
                created_at: "2021-09-01T00:00:00.000Z",
                avatar: "https://pbs.twimg.com/profile_images/1758356007938576385/wihR4F-B_400x400.jpg"
            },
        ])
    }, [username])
    return <div>
        {posts.map((post, i) => <Post key={i} {...post} />)}
    </div>
}

function Post({ id, username, name, text, avatar, created_at }: UserPost) {
    return <Link to={`/${username}/status/${id}`}>
        <article className="border-b p-4 flex">
            <img src={avatar} alt="avatar" className="w-10 h-10 rounded-lg" />
            <div className="ml-2 grow">
                <div className="flex gap-2 items-baseline">
                    <h3 className="font-bold">{name}</h3>
                    <p className="text-gray-500">@{username}</p>
                    <span>·</span>
                    <p className="text-gray-500">{formatDateSince(created_at)}</p>
                </div>
                <p>{text}</p>
            </div>
        </article>
    </Link>
}

function yearMonthFormat(date: string) {
    const dateObj = new Date(date);
    return `${dateObj.toLocaleString('default', { month: "long" })} ${dateObj.getFullYear()}`
}

function formatDateSince(date: string) {
    const dateObj = new Date(date);
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years) return yearMonthFormat(date);
    if (months) return `${months}m`;
    if (days) return `${days}d`;
    if (hours) return `${hours}h`;
    if (minutes) return `${minutes}m`;
    if (seconds) return `${seconds}s`;
    return "now"
}