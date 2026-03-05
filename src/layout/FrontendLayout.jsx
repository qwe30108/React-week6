import React from "react";
import { Link, Outlet } from "react-router";

function FrontendLayout() {
  return (
    <>
      <header>
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              首頁
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/product">
              產品列表
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/cart">
              購物車
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/checkout">
              結帳
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              登入
            </Link>
          </li>
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <div className="container text-center">
          <p className="m-3">copy©test website</p>
        </div>
      </footer>
    </>
  );
}

export default FrontendLayout;
