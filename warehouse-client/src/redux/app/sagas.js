import { all, put, takeLatest } from "redux-saga/effects";
import {
  ADD_LOG,
  ADD_PRODUCT,
  ADD_SHOP,
  DELETE_PRODUCT,
  DELETE_SHOP,
  GET_LOGS,
  SEARCH,
  SIGN_IN,
  UPDATE_PRODUCT,
} from "./types";
import {
  addShopSuccess,
  addShopFailed,
  addProductSuccess,
  addProductFailed,
  updateProductSuccess,
  updateProductFailed,
  deleteProductSuccess,
  deleteProductFailed,
  deleteShopSuccess,
  deleteShopFailed,
  signInSuccess,
  signInFailed,
  searchFailed,
  searchSuccess,
  search,
  addLog,
  addLogFailed,
  addLogSuccess,
  getLogsFailed,
  getLogsSuccess,
  resetErrorMessage,
} from "./actions";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

function* addShop(action) {
  try {
    const response = yield axios.post(`${API_URL}/api/shops`, {
      location: action.payload,
    });
    const message = response.data;
    yield put(addShopSuccess(message));
    yield put(search("shops", ""));
    if (message === "Shop successfully added!")
      yield put(addLog("Shops", `Shop successfully added: ${action.payload}`));
  } catch (err) {
    const message = err.response ? err.response.data : "Failed to add product!";
    yield put(addShopFailed(message));
  }
}

function* onAddShop() {
  yield takeLatest(ADD_SHOP, addShop);
}

function* addProduct(action) {
  try {
    const response = yield axios.post(`${API_URL}/api/products`, {
      name: action.payload.name,
    });
    const message = response.data;
    yield put(addProductSuccess(message));
    yield put(search("products", "", action.payload.location));
    if (message === "Product successfully added!")
      yield put(
        addLog("Products", `Product successfully added: ${action.payload.name}`)
      );
  } catch (err) {
    const message = err.response ? err.response.data : "Failed to add product!";
    yield put(addProductFailed(message));
  }
}

function* onAddProduct() {
  yield takeLatest(ADD_PRODUCT, addProduct);
}

function* updateProduct(action) {
  try {
    const response = yield axios.put(`${API_URL}/api/products`, {
      name: action.payload.name,
      quantity: action.payload.quantity,
      location: action.payload.location,
    });
    const message = response.data;
    yield put(updateProductSuccess(message));
    yield put(
      search("products", action.payload.searchQuery, action.payload.location)
    );
    const newQuantity =
      Number(action.payload.oldQuantity) + Number(action.payload.quantity);
    if (message === "Product successfully updated!")
      yield put(
        addLog(
          action.payload.location,
          `${action.payload.name} quantity successfully updated! Old quantity: ${action.payload.oldQuantity}, New quantity: ${newQuantity}`
        )
      );
  } catch (err) {
    const message = err.response
      ? err.response.data
      : "Failed to update product!";
    yield put(updateProductFailed(message));
  }
}

function* onUpdateProduct() {
  yield takeLatest(UPDATE_PRODUCT, updateProduct);
}

function* deleteProduct(action) {
  try {
    const response = yield axios.delete(`${API_URL}/api/products`, {
      params: {
        name: action.payload.name,
      },
    });
    const message = response.data;
    yield put(deleteProductSuccess(message));
    yield put(
      search("products", action.payload.searchQuery, action.payload.location)
    );
    if (message === "Product successfully deleted!")
      yield put(
        addLog(
          "Products",
          `Product successfully deleted: ${action.payload.name}`
        )
      );
  } catch (err) {
    const message = err.response
      ? err.response.data
      : "Failed to delete product!";
    yield put(deleteProductFailed(message));
  }
}

function* onDeleteProduct() {
  yield takeLatest(DELETE_PRODUCT, deleteProduct);
}

function* deleteShop(action) {
  try {
    const response = yield axios.delete(`${API_URL}/api/shops`, {
      params: {
        location: action.payload.location,
      },
    });
    const message = response.data;
    yield put(deleteShopSuccess(message));
    yield put(search("shops", action.payload.searchQuery));
    if (message === "Shop successfully deleted!")
      yield put(
        addLog("Shops", `Shop successfully deleted: ${action.payload.location}`)
      );
  } catch (err) {
    const message = err.response ? err.response.data : "Failed to delete shop!";
    yield put(deleteShopFailed(message));
  }
}

function* onDeleteShop() {
  yield takeLatest(DELETE_SHOP, deleteShop);
}

function* signIn(action) {
  try {
    const response = yield axios.post(
      `${API_URL}/api/auth`,
      {
        email: action.payload.email,
        password: action.payload.password,
      },
      { headers: { Authorization: action.payload.token } }
    );
    const message = response.data;
    yield put(signInSuccess(message));
  } catch (err) {
    const message = err.response ? err.response.data : "Failed to sign in!";
    yield put(signInFailed(message));
  }
}

function* onSignIn() {
  yield takeLatest(SIGN_IN, signIn);
}

function* searchSaga(action) {
  try {
    yield put(resetErrorMessage());
    const response = yield axios.post(
      `${API_URL}/api/search?for=${action.payload.searchFor}&query=${action.payload.query}&location=${action.payload.location}`
    );
    const message = response.data;
    yield put(searchSuccess(message));
  } catch (err) {
    yield put(searchFailed("Something went wrong! Try again later!"));
  }
}

function* onSearch() {
  yield takeLatest(SEARCH, searchSaga);
}

function* addLogSaga(action) {
  try {
    const response = yield axios.post(`${API_URL}/api/logs`, {
      location: action.payload.location,
      name: action.payload.name,
      message: action.payload.message,
      oldQuantity: action.payload.oldQuantity,
      newQuantity: action.payload.newQuantity,
    });
    const message = response.data;
    yield put(addLogSuccess(message));
  } catch (err) {
    yield put(addLogFailed(err));
  }
}

function* onAddLog() {
  yield takeLatest(ADD_LOG, addLogSaga);
}

function* getLogs() {
  try {
    yield put(resetErrorMessage());
    const response = yield axios.get(`${API_URL}/api/logs`);
    const message = response.data;
    yield put(getLogsSuccess(message));
  } catch (err) {
    yield put(getLogsFailed("Something went wrong! Try again later!"));
  }
}

function* onGetLogs() {
  yield takeLatest(GET_LOGS, getLogs);
}

export default function* appSagas() {
  yield all([
    onAddShop(),
    onAddProduct(),
    onUpdateProduct(),
    onDeleteProduct(),
    onDeleteShop(),
    onSignIn(),
    onSearch(),
    onAddLog(),
    onGetLogs(),
  ]);
}
