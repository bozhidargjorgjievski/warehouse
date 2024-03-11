import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { signIn } from "../redux/app/actions";
import logo from "../images/logo.svg";

import Loader from "../components/Loader/Loader.component";
const { Container, Box, Button, Typography, TextField } = require("@mui/material");

const SignInPage = ({ auth, message, loading }) => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123");
  const myToken = window.sessionStorage.getItem("token");

  const isMessageAString = typeof message === "string";

  const onInputChange = (e, id) => {
    if (id === "email") setEmail(e.target.value);
    if (id === "password") setPassword(e.target.value);
  };

  const handleSignIn = () => {
    auth(email, password, myToken);
  };

  const handlePressEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleSignIn();
    }
  };

  useEffect(() => {
    if (myToken) auth(email, password, myToken);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Container
          data-aos='fade'
          maxWidth={"false"}
          sx={{ padding: "0 !important", display: "flex", alignItems: "center", overflowX: "hidden" }}>
          <Box
            sx={{
              width: "40vw",
              minWidth: "300px",
              height: "100vh",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Box
              sx={{
                width: "50%",
                minWidth: "250px",
                height: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
              }}>
              <Typography variant='h2' color='#28234A' sx={{ fontSize: "2rem", width: "100%", fontWeight: "bold" }}>
                Sign In
              </Typography>
              {message && isMessageAString ? (
                <>
                  <TextField
                    onChange={(e) => onInputChange(e, "email")}
                    variant='outlined'
                    label='Email'
                    error
                    helperText={message}
                    value={email}
                    type='email'
                    sx={{ width: "100%" }}
                    onKeyUp={handlePressEnter}
                  />
                  <TextField
                    onChange={(e) => onInputChange(e, "password")}
                    variant='outlined'
                    label='Password'
                    error
                    value={password}
                    type='password'
                    sx={{ width: "100%" }}
                    onKeyUp={handlePressEnter}
                  />
                </>
              ) : (
                <>
                  <TextField
                    onChange={(e) => onInputChange(e, "email")}
                    variant='outlined'
                    label='Email'
                    value={email}
                    type='email'
                    sx={{ width: "100%" }}
                    onKeyUp={handlePressEnter}
                  />
                  <TextField
                    onChange={(e) => onInputChange(e, "password")}
                    variant='outlined'
                    label='Password'
                    value={password}
                    type='password'
                    sx={{ width: "100%" }}
                    onKeyUp={handlePressEnter}
                  />
                </>
              )}
              <Button onClick={handleSignIn} variant='contained' sx={{ width: "100%" }}>
                Sign In
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              width: "60vw",
              minWidth: "300px",
              height: "60vh",
              backgroundImage: `url(${logo})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}></Box>
        </Container>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.authReducer.message.token,
  message: state.authReducer.message,
  loading: state.authReducer.loading,
});

const mapDispatchToProps = (dispatch) => ({
  auth: (email, password, token) => dispatch(signIn(email, password, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);
