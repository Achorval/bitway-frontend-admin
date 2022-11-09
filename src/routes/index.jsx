import Layout from "layouts/DashboardLayout.jsx";
import {
    LockScreen,
    Login,
    Register,
    Error400,
    ForgotPassword,
    Error500
} from "../views/authentication/index";

const indexRoutes = [
    { path: "/lockscreen", component: LockScreen },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/error400", component: Error400 },
    { path: "/error500", component: Error500 },
    { path: "/forgotPassword", component: ForgotPassword },
    { path: "/", component: Layout }
];

export default indexRoutes;
