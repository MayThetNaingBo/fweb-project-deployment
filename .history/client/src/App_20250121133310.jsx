// App.jsx

import React from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

// Components
import CCA from "./components/Home";
import Layout from "./components/Layout";
import Authentication from "./components/Auth";

/* Public Users */
import Public_Members from "./components/users/Public_Members";
import Public_Events from "./components/users/Public_Events";
import About from "./components/users/Public_About";
import ContactUs from "./components/users/Public_Contact";

/* Admin */
import AdminSignIn from "./components/admins/AdminAuth";
import AdminHome from "./components/admins/AdminHome";
import AdminLayout from "./components/admins/AdminLayout";
import AddMember from "./components/admins/addMember";
import EditMember from "./components/admins/editMember";
import AdminEventList from "./components/admins/AdminEvents";
import EventDetails from "./components/admins/EventDetails";
import EventMembers from "./components/admins/EventMember";
import SelectMembers from "./components/admins/EventAddMembers";
import FeedbackAdmin from "./components/admins/Feedback";
import AdminAbout from "./components/admins/AdminAbout";
import AdminProfile from "./components/admins/AdminProfile";
import AddEvent from "./components/admins/addEvent";
import EditEvent from "./components/admins/editEvent";

/**
 * ProtectedRoute:
 * Wraps a route (or layout) to protect it by role.
 * If there's no user or the role is not allowed, redirects to login page
 * or another route of your choice.
 */
function ProtectedRoute({ allowedRoles, children }) {
    // Retrieve user from localStorage (or any other global auth state)
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    // If no user or no role in user => redirect to /authentication
    if (!user || !user.role) {
        return <Navigate to="/authentication" replace />;
    }

    // If user role not in allowedRoles => redirect (e.g., home page)
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // Otherwise, render the protected page
    return children;
}

// Define your routes
const routes = [
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: <CCA /> },
            { path: "/about", element: <About /> },
            { path: "/contactus", element: <ContactUs /> },
            { path: "/members", element: <Public_Members /> },
            { path: "/events", element: <Public_Events /> },
        ],
    },
    { path: "/authentication", element: <Authentication /> },
    { path: "/adminAuth", element: <AdminSignIn /> },

    // Protect all /admin routes so that only users with role "admin" can access.
    {
        path: "/admin",
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "/admin/home", element: <AdminHome /> },
            { path: "/admin/profile", element: <AdminProfile /> },
            { path: "/admin/events", element: <AdminEventList /> },
            { path: "/admin/about", element: <AdminAbout /> },
            { path: "/admin/contactus", element: <FeedbackAdmin /> },
            { path: "/admin/add", element: <AddMember /> },
            { path: "/admin/edit/:id", element: <EditMember /> },
            { path: "/admin/add/event", element: <AddEvent /> },
            { path: "/admin/edit/event/:id", element: <EditEvent /> },
            { path: "/admin/event/:id", element: <EventDetails /> },
            { path: "/admin/event/:id/members", element: <EventMembers /> },
            {
                path: "/admin/event/:id/select-members",
                element: <SelectMembers />,
            },
        ],
    },
];

// Create the router
const router = createBrowserRouter(routes);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
