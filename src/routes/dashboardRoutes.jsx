
//  PAGES
import UserProfile from "views/profile";
import DashboardPage from "views/dashboard";
import UsersPage from "views/users";
import ServicesPage from "views/services";
import HistoryPage from "views/history";

const dashboardRoutes = [
  // page route
  { path: "/profile", component: UserProfile },
  { path: "/dashboard", component: DashboardPage },
  { path: "/users", component: UsersPage },
  { path: "/services", component: ServicesPage },
  { path: "/history", component: HistoryPage },
];

export default dashboardRoutes;
