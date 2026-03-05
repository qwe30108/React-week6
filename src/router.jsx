import { createHashRouter } from "react-router";
import FrontendLayout from "./layout/FrontendLayout";
import Home from "./views/front/Home";
import NotFound from "./views/front/NotFound";
import Cart from "./views/front/Cart";
import Products from "./views/front/Products";
import SingleProduct from "./views/front/SingleProduct";
import Checkout from "./views/front/Checkout";
import Login from "./views/Login";

export const router = createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
