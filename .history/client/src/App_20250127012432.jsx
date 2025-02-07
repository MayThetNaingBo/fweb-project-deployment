import { createBrowserRouter, RouterProvider } from "react-router-dom";

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


// Members 
import CreatePassword from "./components/members/createPassword";
import MemberLayout from "./components/members/MemberLayout";


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

    {
        path: "/admin",
        element: <AdminLayout />,
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
    // {
    //     path: "/member",
    //     element: <MemberLayout />,
    //     children: [
    //         { path: "/member/create-password", element: <CreatePassword /> },
    //     ],
    // },
];

const router = createBrowserRouter(routes);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
