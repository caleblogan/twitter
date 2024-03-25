import { formatDateSince } from "@/lib/dates";
import { Link, useNavigate } from "react-router-dom";

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
    const navigate = useNavigate()
    function handleClick(username: string, postId: string) {
        navigate(`/@${username}/status/${postId}`)
    }
    return <div className="">
        {posts.map((post, i) => <Post key={i} {...post} {...user} onClick={handleClick} />)}
    </div>
}

export function Post({ id, username, name, text, avatar_url, created_at, onClick }: UserPost & { onClick: (username: string, id: string) => void }) {
    return <article onClick={() => onClick(username, id)} className="hover:bg-slate-100 rounded-md last:border-none border-b p-4 flex cursor-pointer">
        <Link to={`/@${username}`} onClick={e => e.stopPropagation()}><img src={avatar_url} alt="avatar" className="w-10 h-10 rounded-lg" /></Link>
        <div className="ml-2 grow">
            <div className="flex gap-2 items-baseline">
                <h3 className="font-bold">{name}</h3>
                <p className="text-gray-500">@{username}</p>
                <span className="text-gray-500">·</span>
                <p className="text-gray-500">{formatDateSince(created_at)}</p>
            </div>
            <p className="mt-1">{text}</p>
        </div>
    </article >
}

