import Api from "./api"

export namespace CommentsApi {
    export async function create(params: { text: string, post_id: string }): Promise<{}> {
        const data = await Api.post(`/comments`, { body: JSON.stringify(params) })
        return data.comment
    }
}