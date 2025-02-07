import { Outlet, useLocation } from "react-router-dom";
import MemberNavBar from "./AdminNav";

export default function AdminLayout() {
    const location = useLocation();

    // Routes where NavBar should NOT appear
    const noNavBarRoutes = ["/authentication", "/adminAuth"];
    const hideNavBar = noNavBarRoutes.some((path) =>
        location.pathname.startsWith(path)
    );

    return (
        <div style={{ paddingTop: hideNavBar ? "0px" : "60px" }}>
            {" "}
            {/* Add padding only when navbar exists istead of defining in the css*/}
            {!hideNavBar && <AdminNavBar />}
            <Outlet />
        </div>
    );
}
