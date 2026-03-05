import React, { useState } from "react";
import axios from "axios";
import "../assets/style.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({ getData, setIsAuth }) {
  // const [formData, setFormData] = useState({
  //   username: "",
  //   password: "",
  // });

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const handInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  // 處理登入
  const onSubmit = async (formData) => {
    // e.preventDefault();
    try {
      //發送登入請求
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      // console.log(response.data);

      const { token, expired } = response.data;

      //儲存token到cookie
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;

      //設定axios預設header
      axios.defaults.headers.common.Authorization = token;

      //載入產品資料
      // getData();

      //更新登入狀態
      // setIsAuth(true);

      Swal.fire({
        title: "登入成功",
        text: response.data.message,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="container login">
      <h1>請先登入</h1>
      <form className="form-floating" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            name="username"
            placeholder="name@example.com"
            {...register("username", {
              required: "請輸入 Email 帳號",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email 格式不正確",
              },
            })}
            // value={formData.username}
            // onChange={(e) => handInputChange(e)}
          />
          <label htmlFor="username">Email address</label>
          {errors.username && (
            <p className="text-danger">{errors.username.message}</p>
          )}
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            {...register("password", {
              required: "請輸入密碼",
              minLength: {
                value: 8,
                message: "密碼長度至少8碼",
              },
            })}
            // value={formData.password}
            // onChange={(e) => handInputChange(e)}
          />
          <label htmlFor="password">Password</label>
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-3">
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;
