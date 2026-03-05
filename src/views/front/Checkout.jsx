import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Bars } from "react-loader-spinner";
import * as bootstrap from "bootstrap";
import SingleProductModal from "../../components/SingleProductModal";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Checkout() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loadingCartId, setLoadingCardId] = useState([null]);
  const [loadingProductId, setLoadingProductId] = useState([null]);
  const productModalRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/products`,
        );
        // console.log(response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    getProducts();

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

    productModalRef.current = new bootstrap.Modal(`#productModal`, {
      keyboard: false,
    });

    document
      .querySelector(`#productModal`)
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
  }, []);

  const addCart = async (id, qty = 1) => {
    setLoadingCardId(id);
    try {
      const data = {
        product_id: id,
        qty,
      };
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });
      // console.log(response.data);
      Swal.fire({
        title: "成功加入購物車",
        text: response.data.message,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      // console.log(response2.data.data);
      setCart(response2.data.data);
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setLoadingCardId(null);
    }
  };

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
      // console.log(response.data);
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
      // console.log(response.data);

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

  const onSubmit = async (formData) => {
    try {
      const data = {
        user: formData,
        message: formData.message,
      };
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data,
      });
      // console.log(response.data);
      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      // console.log(response2.data.data);
      setCart(response2.data.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `${error.response.data.message}`,
      });
    }
    // console.log(formData);
  };

  const handleView = async (id) => {
    setLoadingProductId(id);
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/product/${id}`,
      );
      //   console.log(response.data.product);
      setProduct(response.data.product);
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setLoadingProductId(null);
    }

    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  return (
    <div className="container">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: "200px" }}>
                <div
                  style={{
                    height: "100px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${product.imageUrl})`,
                  }}
                ></div>
              </td>
              <td>{product.title}</td>
              <td>
                <del className="h6">原價 : {product.origin_price}</del>
                <div className="h5">特價 : {product.price}</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleView(product.id)}
                  >
                    {loadingProductId === product.id ? (
                      <Bars
                        height="16"
                        width="80"
                        color="#4fa94d"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      />
                    ) : (
                      "查看更多"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => addCart(product.id)}
                    disabled={loadingCartId === product.id}
                  >
                    {loadingCartId === product.id ? (
                      <Bars
                        height="16"
                        width="80"
                        color="#c3f0c3"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      />
                    ) : (
                      "加到購物車"
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
      {cart.carts && cart.carts.length > 0 ? (
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
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
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
      ) : (
        <h2 className="mt-4">購物車無產品</h2>
      )}

      {/* 結帳 */}
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              type="text"
              className="form-control"
              placeholder="請輸入姓名"
              {...register("name", {
                required: "請輸入姓名",
                minLength: {
                  value: 2,
                  message: "最少兩個字",
                },
              })}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              {...register("email", {
                required: "請輸入 Email",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email 格式不正確。",
                },
              })}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              type="tel"
              className="form-control"
              placeholder="請輸入電話"
              {...register("tel", {
                required: "請輸入電話",
                minLength: {
                  value: 8,
                  message: "號碼至少需要8碼",
                },
                pattern: {
                  value: /^\d+$/,
                  message: "格式錯誤，僅限數字",
                },
              })}
            />
            {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
              {...register("address", {
                required: "請輸入收件人地址",
              })}
            />
            {errors.address && (
              <p className="text-danger">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              placeholder="留言"
              rows="3"
              {...register("message")}
            />
          </div>

          <div className="text-end">
            <button
              type="submit"
              className="btn btn-danger"
              disabled={!cart.carts || cart.carts.length === 0}
            >
              送出訂單
            </button>
          </div>
        </form>
      </div>
      <SingleProductModal
        product={product}
        addCart={addCart}
        closeModal={closeModal}
      />
    </div>
  );
}

export default Checkout;
