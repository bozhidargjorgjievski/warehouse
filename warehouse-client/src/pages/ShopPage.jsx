import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router";

import {
  addProduct,
  resetMessage,
  search,
  setSearchQuery,
} from "../redux/app/actions";

import autoCapitalizeString from "../utils/autoCapitalize";
import capitalize from "../utils/capitalize";

import { Container } from "@mui/material";

import ScrollToTop from "../components/ScrollToTop/ScrollToTop.component";
import ProductList from "../components/ProductList/ProductList.component";
import Loader from "../components/Loader/Loader.component";
import Header from "../components/Header/Header.component";
import AddForm from "../components/AddForm/AddForm.component";
import Message from "../components/Message/Message.component";
import ErrorMessage from "../components/NetworkFail/ErrorMessage.component";

const ShopPage = ({
  shop,
  addProductMessage,
  addProduct,
  loadingAddProduct,
  resetMessage,
  token,
  onSearch,
  searchQuery,
  setSearchQuery,
  errorMessage,
}) => {
  const [messageName, setMessageName] = useState("");

  const onAddProduct = (productName) => {
    const name = autoCapitalizeString(productName);
    addProduct(name, shopLocation);
    resetMessage();
    changeMessageName("Add");
  };

  const onPressEnter = (productName) => {
    onAddProduct(productName);
  };

  const location = useLocation();
  let shopLocation = location.pathname
    .replace("/shops/", "")
    .replace("%20", " ");

  shopLocation = capitalize(shopLocation);

  if (shopLocation === "/") shopLocation = "Warehouse";

  const changeMessageName = (name) => {
    setMessageName(name);
  };

  useEffect(() => {
    if (token) window.sessionStorage.setItem("token", token);

    return () => setSearchQuery("");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    searchQuery
      ? onSearch("products", searchQuery, shopLocation)
      : onSearch("products", "", shopLocation);

    // eslint-disable-next-line
  }, [searchQuery, shopLocation]);

  return (
    <ScrollToTop>
      <Header />
      {errorMessage ? (
        <ErrorMessage errorMessage={errorMessage} />
      ) : shop ? (
        <Container data-aos="fade" maxWidth="lg" sx={{ my: 5 }}>
          <ProductList
            shopLocation={shop.location || shop.name}
            messageName={messageName}
            changeMessageName={changeMessageName}
          />
          {addProductMessage && messageName === "Add" ? (
            <Message
              message={addProductMessage.message}
              type={addProductMessage.type}
              onClick={resetMessage}
            />
          ) : null}
          {shopLocation === "Warehouse" ? (
            <AddForm
              loading={loadingAddProduct}
              placeholder="Product Name"
              buttonLabel="Add Product"
              onClick={onAddProduct}
              onKeyUp={onPressEnter}
            />
          ) : null}
        </Container>
      ) : (
        <Loader />
      )}
    </ScrollToTop>
  );
};

const mapStateToProps = (state) => ({
  shop: state.searchReducer.searchResult,
  loadingAddProduct: state.productReducer.addProductLoading,
  addProductMessage: state.productReducer.message,
  token: state.authReducer.message.token,
  searchQuery: state.searchReducer.searchQuery,
  errorMessage: state.searchReducer.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  addProduct: (name, location) => dispatch(addProduct(name, location)),
  resetMessage: () => dispatch(resetMessage()),
  onSearch: (searchFor, query, location) =>
    dispatch(search(searchFor, query, location)),
  setSearchQuery: (query) => dispatch(setSearchQuery(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopPage);
