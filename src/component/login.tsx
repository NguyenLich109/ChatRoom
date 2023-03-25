import { useEffect } from "react";
import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { getUser, login } from "../redux/reducer";
import { useAppDispatch, useAppSelector } from "../redux/hookReudx";
import { auth, db } from "../firebase/config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import "./index.scss";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
        dispatch(
          getUser({
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
            id: user.uid,
          })
        );
      }
    });
  }, [dispatch]);

  const provider = new GoogleAuthProvider();

  const handleLogin = () => {
    signInWithPopup(auth, provider).then((result) => {
      dispatch(
        login({
          name: result.user.displayName,
          email: result.user.email,
          image: result.user.photoURL,
          id: result.user.uid,
        })
      );
    });
  };
  return (
    <>
      <div className="login">
        <h1 className="login-text">Đăng nhập</h1>
        <div className="login-button">
          <Button
            onClick={handleLogin}
            className="login-button__google"
            icon={<GoogleOutlined />}
          >
            Tiếp tục với Google
          </Button>
        </div>
      </div>
    </>
  );
}
