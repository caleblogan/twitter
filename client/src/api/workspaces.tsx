import WorkspaceModel from "../../../server/src/models/WorspaceModel"
import Api from "./api"

// TODO: Refactor this to use namespace below
export async function listWorkspaces(): Promise<WorkspaceModel[]> {
    const response = await Api.get(`/users/workspaces`)
    return response?.workspaces
}

// TODO: Refactor this to use namespace below
export async function getWorkpace(workspaceId: string): Promise<WorkspaceModel> {
    const response = await Api.get(`/workspaces/${workspaceId}`)
    return response?.workspace
}

export namespace WorkspaceApi {
    export async function create(name: string) {
        const response = await Api.post(`/workspaces`, { body: JSON.stringify({ name }) })
        return response?.workspace
    }
}