import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
    const location = useLocation();

    // Routes where NavBar should not appear
    const noNavBarRoutes = ["/authentication", "/adminAuth"];
    const hideNavBar = noNavBarRoutes.some((path) =>
        location.pathname.startsWith(path)
    );

    return (
        <>
            {!hideNavBar && <NavBar />}
            <Outlet />
        </>
    );
}
