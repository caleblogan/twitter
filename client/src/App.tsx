import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { UserContext } from './context';
import { useEffect, useState } from 'react';
import { ApiUser } from '../../server/src/models/UserModel';
import Client from './pages/Client/Client';
import HomePage from './pages/HomePage';
import DMsPage from './pages/DMsPage';
import ActivityPage from './pages/ActivityPage';
import LaterPage from './pages/LaterPage';
import { getMe } from './api/users';
import Redirect from './components/Redirect';
import ChannelsPage from './pages/ChannelsPage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Redirect to="/client" />
  },
  {
    path: "/client/:workspaceId?",
    element: <Client />,
    children: [
      {
        path: ":channelId?",
        element: <HomePage />
      },
      {
        path: "dms",
        element: <DMsPage />
      },
      {
        path: "activity",
        element: <ActivityPage />
      },
      {
        path: "later",
        element: <LaterPage />
      },
      {
        path: "channels",
        element: <ChannelsPage />
      },
    ]
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