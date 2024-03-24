import { FeedApi } from "@/api/feed";
import { UsersApi } from "@/api/users";
import MainLayout from "@/components/MainLayoutSingle";
import PostsFeed, { UserPost } from "@/components/Posts";
import { Button } from "@/components/ui/button";
import { yearMonthFormat } from "@/lib/dates";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PublicUserApi } from "../../../server/src/controllers/users";
import LogoutButton from "@/components/LogoutButton";
import { FollowersApi } from "@/api/followers";

export default function UserFeedPage() {
    const { username } = useParams();
    const [publicUser, setPublicUser] = useState<PublicUserApi | null>(null);
    const [posts, setPosts] = useState<UserPost[]>([]);

    useEffect(() => {
        if (!username) return
        UsersApi.getPublicUser(username.replace("@", ""))
            .then(response => {
                setPublicUser(response)
            })
        loadFeed(username)
    }, [username])

    async function loadFeed(username: string) {
        const response = await FeedApi.getFeedByUsername(username.replace("@", ""))
        setPosts(response)
    }

    if (!publicUser) return <MainLayout className="border"></MainLayout>

    return <MainLayout className="border">
        <header className="stick h-[53px] p-2 flex justify-between">
            <div>
                <h1 className="text-xl font-bold ml-4">{publicUser.name}</h1>
                <h2 className="text-sm text-gray-500 ml-4 mt-[-2px]">95k posts</h2>
            </div>
            <LogoutButton className="mr-2" />
        </header>
        <section className="">
            <div className="relative">
                <img alt="" draggable="true" src={publicUser.banner_url ?? "https://pbs.twimg.com/profile_banners/43024351/1708059730/600x200"}
                    className="" />
                <img src={publicUser?.avatar_url} alt="avatar" className="w-32 rounded-lg absolute bottom-[-60px] ml-4 border-[4px] border-white" />
            </div>
            <div className="flex justify-end">
                <FollowUnfollowButton username={publicUser.username} />
            </div>
            <div className="pl-6 mt-4">
                <h1 className="text-xl font-bold">{publicUser.name}</h1>
                <h2 className="text-sm text-gray-600">@{publicUser?.username}</h2>
                <p className="flex text-gray-500 mt-4 items-center gap-2"><CalendarIcon /> Joined {yearMonthFormat(publicUser.created_at)}</p>
            </div>
            <div className="flex gap-4 ml-6 mt-4">
                <div className="text-sm font-bold">258 <span className="text-gray-500 font-normal">following</span></div>
                <div className="text-sm font-bold">32k <span className="text-gray-500 font-normal">followers</span></div>
            </div>
        </section>

        <section className="mt-4 p-4">
            <h1 className="p-4 text-xl font-bold">Posts</h1>
            <PostsFeed posts={posts} user={publicUser} />
        </section>
    </MainLayout>
}

function FollowUnfollowButton({ username }: { username: string }) {
    const [isFollowing, setIsFollowing] = useState(false)

    useEffect(() => {
        FollowersApi.isFollowing(username)
            .then(({ isFollowing }) => setIsFollowing(isFollowing))
    }, [username])

    async function handleFollow() {
        await FollowersApi.follow(username)
    }
    async function handleUnfollow() {
        await FollowersApi.unfollow(username)
    }
    function handleClick() {
        if (isFollowing) {
            handleUnfollow()
        } else {
            handleFollow()
        }
        setIsFollowing(!isFollowing)

    }
    return <Button size="default" className="rounded-2xl mt-3 mr-4" onClick={handleClick}>
        {isFollowing ? "Unfollow" : "Follow"}
    </Button>
}
