import { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import "./assets/style.css";
import ProductModal from "./components/ProductModal";
import Pagination from "./components/Pagination";
import Login from "./views/Login";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({});
  const productModalRef = useRef(null);

  // 取得產品資料
  const getData = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      // console.log(response.data);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // 檢查登入狀態
  useEffect(() => {
    const token = document.cookie
      .split(";")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
    if (token) {
      //設定axios預設header
      axios.defaults.headers.common.Authorization = token;
    }

    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });

    const checkLogin = async () => {
      try {
        const response = await axios.post(`${API_BASE}/api/user/check`);
        // console.log(response.data);
        // alert("目前處於登入狀態");
        setIsAuth(true);
        getData();
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    checkLogin();
  }, []);

  const openModal = (type, product) => {
    // 設定 Modal 類型並顯示
    setModalType(type);
    setTemplateProduct((pre) => ({
      ...pre,
      ...product,
    }));
    productModalRef.current.show();
    // console.log(product);
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  return (
    <>
      {!isAuth ? (
        <Login getData={getData} setIsAuth={setIsAuth} />
      ) : (
        <div className="container">
          <h2 className="mt-3">產品列表</h2>
          <div className="text-end mt-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
            >
              建立新的產品
            </button>
          </div>
          <div className="row mt-5">
            <table className="table">
              <thead>
                <tr>
                  <th>分類</th>
                  <th>產品名稱</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>是否啟用</th>
                  <th>編輯</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.category}</td>
                    <td>{product.title}</td>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td className={`${product.is_enabled && `text-success`}`}>
                      {product.is_enabled ? `啟用` : `未啟用`}
                    </td>
                    <td>
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => openModal("edit", product)}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => openModal("delete", product)}
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination pagination={pagination} onChangePage={getData} />
          </div>
        </div>
      )}

      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        getData={getData}
        closeModal={closeModal}
      />
    </>
  );
}

export default App;
