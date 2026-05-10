import { useState, useEffect } from "react";
import { connect } from "react-redux";

import { updateProduct, deleteProduct, resetMessage } from "../../redux/app/actions";

import { Paper, Box, LinearProgress, Typography } from "@mui/material";

import ProductCard from "../ProductCard/ProductCard.component";
import SearchField from "../SearchField/SearchField.component";
import Message from "../Message/Message.component";

const ProductList = ({
  products,
  searchLoading,
  onSearchChange,
  shopLocation,
  searchQuery,
  updateProduct,
  resetMessage,
  message,
  updateProductLoading,
  deleteProductLoading,
  deleteProduct,
  messageName,
  changeMessageName,
}) => {
  const onOrder = (name, quantityToOrder, quantity) => {
    updateProduct(name, quantityToOrder, shopLocation, searchQuery, quantity);
    changeMessageName(name);
    resetMessage();
  };

  const clearMessage = () => {
    resetMessage();
  };

  const onDeleteProduct = (name) => {
    deleteProduct(name, shopLocation, searchQuery);
    changeMessageName(name);
    resetMessage();
  };

  const [productsToLoad, setProductsToLoad] = useState(10);

  const filteredProducts = products ? products.filter((log, idx) => idx < productsToLoad) : null;

  const scroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      setProductsToLoad((productsToLoad) => productsToLoad + 10);
    }
  };

  useEffect(() => {
    if (products) productsToLoad < products.length && window.addEventListener("scroll", scroll);
    return () => window.removeEventListener("scroll", scroll);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Paper elevation={0} sx={{ my: 5, borderRadius: "30px 30px 0 0" }}>
        <Typography variant='h1' align='center' color='#28234A' sx={{ mb: 5, py: 5, fontSize: "3.8rem" }}>
          {shopLocation}
        </Typography>
        <SearchField onSearchChange={onSearchChange} />
        <Box sx={{ position: "relative", paddingTop: "20px" }}>
          {searchLoading && (
            <Box sx={{ width: "100%", position: "absolute" }}>
              <LinearProgress />
            </Box>
          )}
        </Box>
        {message && message.sticky && <Message message={message.message} type={message.type} sticky={message.sticky} />}
        {filteredProducts &&
          filteredProducts.map(({ productId, name, ...otherProps }) => (
            <ProductCard
              key={productId}
              name={name}
              {...otherProps}
              message={message && name === messageName ? message : null}
              updateProductLoading={updateProductLoading && name === messageName ? updateProductLoading : null}
              onOrder={onOrder}
              clearMessage={clearMessage}
              onDeleteProduct={onDeleteProduct}
              deleteProductLoading={deleteProductLoading && name === messageName ? deleteProductLoading : null}
              location={shopLocation}
            />
          ))}
      </Paper>
    </>
  );
};

const mapStateToProps = (state) => ({
  products: state.searchReducer.searchResult.products,
  searchLoading: state.searchReducer.loading,
  updateProductLoading: state.productReducer.updateProductLoading,
  deleteProductLoading: state.productReducer.deleteProductLoading,
  message: state.productReducer.message,
  searchQuery: state.searchReducer.searchQuery,
});

const mapDispatchToProps = (dispatch) => ({
  updateProduct: (name, quantity, location, searchQuery, oldQuantity) =>
    dispatch(updateProduct(name, quantity, location, searchQuery, oldQuantity)),
  deleteProduct: (name, location, searchQuery) => dispatch(deleteProduct(name, location, searchQuery)),
  resetMessage: () => dispatch(resetMessage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
