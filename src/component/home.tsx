import { useEffect } from "react";
import {
  MessageOutlined,
  LikeOutlined,
  SendOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button, Row, Col, Spin } from "antd";
import Header from "./header";
import "../reposive.scss";
import Navbar from "./navbar";
import Messenger from "./zoom/messenger";
import { useAppSelector, useAppDispatch } from "../redux/hookReudx";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getRooms, getUser } from "../redux/reducer";

export default function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const statusGetUser = useAppSelector((state) => state.chatRoom.statusGetUser);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          getUser({
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
            id: user.uid,
          })
        );
      } else {
        navigate("/login");
      }
    });
  }, [dispatch]);

  return (
    <>
      <Header />
      {statusGetUser ? (
        <Spin
          size="large"
          indicator={<LoadingOutlined />}
          style={{ position: "absolute", left: "50%", top: "10%" }}
        />
      ) : (
        <div className="home">
          <Row>
            <Col className="col-gird" xs={24} sm={4} md={4} lg={4} xl={4}>
              <Navbar />
            </Col>
            <Col className="col-gird" xs={0} sm={20} md={20} lg={20} xl={20}>
              <Messenger />
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}
