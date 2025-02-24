import { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { useAuthContext } from "../context/authContext";
import { User } from "../context/authContext";

export function ProtectedLayout() {

  const user = useLoaderData() as User;
  const { setUser } = useAuthContext();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <div style={{ height: "86vh", width: "100vw" }}>

      <Outlet />
    </div>
  );
}
