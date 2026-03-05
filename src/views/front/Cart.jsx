import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        // console.log(response.data.data);
        setCart(response.data.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    getCart();
  }, []);

  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const data = {
        product_id: productId,
        qty: qty,
      };
      const response = await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        { data },
      );
      // console.log(response.data);
      Swal.fire({
        title: "數量已更新",
        text: response.data.message,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      // console.log(response2.data.data);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response.data.message);
      Swal.fire({
        icon: "error",
        title: `${error.response.data.message}`,
      });
    }
    // updateCart();
  };

  const deleteCarts = async () => {
    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      console.log(response.data);
      Swal.fire({
        title: "購物車已清空",
        text: response.data.message,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      // console.log(response2.data.data);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response.data.message);
      Swal.fire({
        icon: "error",
        title: `${error.response.data.message}`,
      });
    }
  };

  const deleteCart = async (cartId, title) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
      );
      console.log(response.data);
      // Swal.fire(`成功刪除 ${title}`);
      Swal.fire({
        title: `成功刪除 ${title}`,
        text: response.data.message,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      // console.log(response2.data.data);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response.data.message);
      Swal.fire({
        icon: "error",
        title: `${error.response.data.message}`,
      });
    }
  };

  const goCheckoout = () => {
    navigate("/checkout");
  };

  return cart.carts && cart.carts.length > 0 ? (
    <div className="container">
      <h2 className="mt-4">購物車列表</h2>
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => deleteCarts()}
        >
          清空購物車
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th scope="col">小計</th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((cartItem) => (
            <tr key={cartItem.id}>
              <td scope="row">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() =>
                    deleteCart(cartItem.id, cartItem.product.title)
                  }
                >
                  刪除
                </button>
              </td>
              <td>{cartItem.product.title}</td>
              <td>
                <div className="input-group input-group-sm mb-3">
                  <input
                    type="number"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    defaultValue={cartItem.qty}
                    onChange={(e) =>
                      updateCart(
                        cartItem.id,
                        cartItem.product_id,
                        Number(e.target.value),
                      )
                    }
                  />
                  <span className="input-group-text" id="inputGroup-sizing-sm">
                    {cartItem.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{cartItem.final_total}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end" colSpan="3">
              總計:
            </td>
            <td className="text-end">{cart.final_total}</td>
          </tr>
        </tfoot>
      </table>
      <button
        type="button"
        className="btn btn-success"
        onClick={() => goCheckoout()}
      >
        前往結帳
      </button>
    </div>
  ) : (
    <div className="container">
      <h2 className="mt-4">購物車無產品</h2>
    </div>
  );
}

export default Cart;
