import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

import CCA from "./components/Home";
import Layout from "./components/LayOut";
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

// Members
import CreatePassword from "./components/members/createPassword";
import MemberAuth from "./components/members/MemberAuth";
import MemberHome from "./components/members/MemberHome";
import MemberLayout from "./components/members/MemberLayout";
import MemberAbout from "./components/members/MemberAbout";
import MemberEvents from "./components/members/MemberEvents";
import MemberFeedback from "./components/members/MemberFeedback";
import MemberEventDetails from "./components/members/MemberEventDetails";
import RegistrationRequests from "./components/admins/RegistrationRequests";
import MemberProfile from "./components/members/MemberProfile";
import MemberOwnEvents from "./components/members/MemberOwnEvents";

function ProtectedRoute({ role, children }) {
    const userRole = localStorage.getItem("role");

    // If no role is found in localStorage, redirect to authentication
    if (!userRole) {
        return <Navigate to="/authentication" replace />;
    }

    // If the user's role does not match the required role, redirect to authentication
    if (userRole !== role) {
        return <Navigate to="/authentication" replace />;
    }

    return children;
}

// Define routes
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
    { path: "/memberAuth", element: <MemberAuth /> },

    // Admin Routes with Authentication
    {
        path: "/admin",
        element: (
            <ProtectedRoute role="admin">
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
            {
                path: "/admin/event/:id/requests",
                element: <RegistrationRequests />,
            },
        ],
    },

    // Member Routes with Authentication
    {
        path: "/member",
        element: (
            <ProtectedRoute role="member">
                <MemberLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "/member/members", element: <MemberHome /> },
            { path: "/member/about", element: <MemberAbout /> },
            { path: "/member/events", element: <MemberEvents /> },
            { path: "/member/feedback", element: <MemberFeedback /> },
            { path: "/member/event/:id", element: <MemberEventDetails /> },
            { path: "/member/profile", element: <MemberProfile /> },
            { path: "/member/members/events", element: <MemberOwnEvents /> },
        ],
    },

    {
        path: "/member/create-password",
        element: <CreatePassword />,
    },
];

const router = createBrowserRouter(routes);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
