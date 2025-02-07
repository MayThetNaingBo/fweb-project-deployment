import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
    const location = useLocation(); // Get current route

    // List of routes where the NavBar should NOT appear
    const noNavBarRoutes = ["/authentication", "/adminAuth"];

    // Check if the current route is in the noNavBarRoutes list
    const hideNavBar = noNavBarRoutes.some((path) =>
        location.pathname.startsWith(path)
    );

    return (
        <>
            {!hideNavBar && <NavBar />} {/* Render NavBar only if not in noNavBarRoutes */}
            <Outlet />
        </>
    );
}
