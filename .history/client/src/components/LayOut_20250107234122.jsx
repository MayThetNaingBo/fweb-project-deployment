import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
    const location = useLocation();

    // Routes where NavBar should NOT appear
    const noNavBarRoutes = ["/authentication", "/adminAuth"];
    const hideNavBar = noNavBarRoutes.some((path) =>
        location.pathname.startsWith(path)
    );

    return (
        <div style={{ paddingTop: hideNavBar ? "0px" : "60px" }}> {/* Add padding only when navbar exists */}
            {!hideNavBar && <NavBar />}
            <Outlet />
        </div>
    );
}
