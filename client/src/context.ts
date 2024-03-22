import { createContext } from "react";
import { ApiUser } from "../../server/src/models/UserModel";

export const UserContext = createContext<{ user: ApiUser | null, reloadUser: Function }>({ user: null, reloadUser: () => { } });
