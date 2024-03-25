import { formatDateSince } from "@/lib/dates";
import { Link } from "react-router-dom";

type Comment = {
    id: string
    username: string;
    text: string
    created_at: string
}

type User = {
    avatar_url?: string
    name: string
}

export type UserComment = Comment & User;

export function Comments({ comments }: { comments: UserComment[] }) {
    console.log(comments)
    return <div>
        {comments.map(comment => <Comment key={comment.id} comment={comment} />)}
    </div>
}

// TODO: date is wrong... getting -1 year ago
export function Comment({ comment }: { comment: UserComment }) {
    return <div className="flex gap-2 items-start p-2 pt-4 pb-4 border-b">
        <Link to={`/@${comment.username}`}>
            <img src={comment.avatar_url} alt="avatar" width={40} height={40} className="w-10 h-10 rounded-lg" />
        </Link>
        <div className="ml-2 grow">
            <div className="flex gap-2 items-baseline">
                <h3 className="font-bold">{comment.name}</h3>
                <p className="text-gray-500">@{comment.username}</p>
                <span className="text-gray-500">·</span>
                <p className="text-gray-500">{formatDateSince(comment.created_at)}</p>
            </div>
            <p className="mt-1">{comment.text}</p>
        </div>

    </div>
}