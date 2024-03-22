import MessageModel from "../../../server/src/models/MessageModel"
import { UserModel } from "../../../server/src/models/UserModel"
import Api from "./api"

export namespace MessagesApi {
    export async function create(channelId: string, text: string): Promise<(MessageModel & UserModel)[]> {
        const response = await Api.post(`/messages`, { body: JSON.stringify({ channel_id: channelId, text }) })
        return response?.message
    }
}
