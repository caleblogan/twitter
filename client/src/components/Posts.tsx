import { formatDateSince } from "@/lib/dates";
import { Link } from "react-router-dom";

type Post = {
    id: string
    username: string;
    text: string
    created_at: string
}

type User = {
    avatar_url?: string
    name: string
}

export type UserPost = Post & User

export default function PostsFeed({ posts, user }: { posts: UserPost[], user: User }) {
    console.log(user)
    return <div className="">
        {posts.map((post, i) => <Post key={i} {...post} {...user} />)}
    </div>
}

function Post({ id, username, name, text, avatar_url, created_at }: UserPost) {
    return <article className="flex hover:bg-slate-100 rounded-md last:border-none border-b">
        <Link to={`/${username}/status/${id}`} className="p-4">
            <img src={avatar_url} alt="avatar" className="w-10 h-10 rounded-lg" />
            <div className="ml-2 grow">
                <div className="flex gap-2 items-baseline">
                    <h3 className="font-bold">{name}</h3>
                    <p className="text-gray-500">@{username}</p>
                    <span className="text-gray-500">·</span>
                    <p className="text-gray-500">{formatDateSince(created_at)}</p>
                </div>
                <p className="mt-1">{text}</p>
            </div>
        </Link>
    </article >
}

