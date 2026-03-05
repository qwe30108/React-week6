import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  // const location = useLocation();
  // const product = location.state?.productData;

  const { id } = useParams();
  const [product, setProduct] = useState();

  useEffect(() => {
    const handleView = async (id) => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`,
        );
        // console.log(response.data.product);
        setProduct(response.data.product);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    handleView(id);
  }, [id]);

  const addCart = async (id, qty = 1) => {
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
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return !product ? (
    <h2>查無此產品</h2>
  ) : (
    <div className="container">
      <div className="card mt-5" style={{ width: `18rem` }}>
        <img
          src={product.imageUrl}
          className="card-img-top"
          alt={product.title}
        />
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.description}</p>
          <p className="card-text">價格:{product.price}</p>
          <p className="card-text">
            <small className="text-body-secondary">{product.unit}</small>
          </p>
          <button
            className="btn btn-primary"
            onClick={() => addCart(product.id)}
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
