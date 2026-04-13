import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import RestaurantsPage from "./pages/RestaurantsPage";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";
import CartPage from "./pages/CartPage";
import DeliveryTrackingPage from "./pages/DeliveryTrackingPage";
import RatingsPage from "./pages/RatingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "login", Component: LoginPage },
      { path: "signup", Component: SignupPage },
      { path: "profile", Component: ProfilePage },
      { path: "restaurants", Component: RestaurantsPage },
      { path: "restaurant/:id", Component: RestaurantMenuPage },
      { path: "cart", Component: CartPage },
      { path: "delivery/:orderId", Component: DeliveryTrackingPage },
      { path: "ratings", Component: RatingsPage },
      { path: "notifications", Component: NotificationsPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);