import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { UserContext } from './context';
import { useEffect, useState } from 'react';
import { ApiUser } from '../../server/src/models/UserModel';
import { getMe } from './api/users';
import LoginPage from './pages/LoginPage';
import Feed from './pages/FeedPage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  }, {
    path: "/feed",
    element: <Feed />
  }, {
    path: "/:username",
    element: <Feed />
  }
]);

export default function App() {
  const [user, setUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    loadUser()
  }, [])

  function loadUser() {
    getMe()
      .then((thisUser) => { setUser(thisUser); })
      .catch((err) => {
        console.error("Failed to load user", err)
        setUser(null)
      })
  }

  return (
    <>
      <UserContext.Provider value={{ user, reloadUser: loadUser }}>
        <RouterProvider router={router} />
      </UserContext.Provider >
    </>
  );
}