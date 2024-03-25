import MainLayout from "@/components/MainLayoutSingle";
import { Post, UserPost } from "@/components/Posts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostsApi } from "@/api/posts";
import { Button } from "@/components/ui/button";
import { Comments, UserComment } from "@/components/Comments";
import { CommentsApi } from "@/api/comments";

export default function PostPage() {
    const { postId } = useParams();
    const [post, setPost] = useState<UserPost | null>(null);
    const [comments, setComments] = useState<UserComment[]>([])

    console.log("PostPage", postId, post)

    useEffect(() => {
        if (!postId) return
        PostsApi.get(postId)
            .then(response => {
                setPost(response)
            })
    }, [postId])

    useEffect(() => {
        loadComments()
    }, [postId])

    async function loadComments() {
        console.log("Loading comments")
        if (!postId) return
        PostsApi.getComments(postId)
            .then(newComments => {
                setComments(newComments)
            })
    }

    if (!post) return null

    return <MainLayout className="border">
        <section className="mt-4 p-4 border-b">
            <Post {...post} onClick={() => null} />
        </section>
        <section className="p-4 pb-6 border-b">
            <h2 className="mb-4 ml-0">Comments</h2>
            <CommentForm onSubmit={loadComments} post_id={postId!} />
        </section>
        <section className="p-4 pt-0">
            <Comments comments={comments} />
        </section>
    </MainLayout>
}

function CommentForm({ onSubmit, post_id }: { onSubmit: () => void, post_id: string }) {
    const [value, setValue] = useState("")
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        await CommentsApi.create({ text: value, post_id })
        onSubmit()
        setValue("")
    }
    return <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
        <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            className="w-full p-2 border resize-none rounded-md"
            placeholder="Write a comment..." />
        <Button className="px-4 py-2 rounded-md">Comment</Button>
    </form>
}