import { useEffect, useState } from "react";
import {
  MessageOutlined,
  LikeOutlined,
  SendOutlined,
  LoadingOutlined,
  CommentOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Row, Col, Spin, Dropdown } from "antd";
import Header from "./header";
import "../reposive.scss";
import Navbar from "./navbar";
import Messenger from "./zoom/messenger";
import { useAppSelector, useAppDispatch } from "../redux/hookReudx";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getRooms, getUser, logOut, outRoom } from "../redux/reducer";

export default function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const statusGetUser = useAppSelector((state) => state.chatRoom.statusGetUser);
  const detailStatusRoom = useAppSelector(
    (state) => state.chatRoom.statusDetailRoom
  );

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

  const handleOutRoom = () => {
    dispatch(outRoom());
  };

  return (
    <div className="container-mess">
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
            <Col
              className="col-gird"
              xs={!detailStatusRoom ? 24 : 0}
              sm={!detailStatusRoom ? 24 : 0}
              md={8}
              lg={8}
              xl={6}
            >
              <Navbar />
            </Col>
            <Col
              className="col-gird"
              xs={!detailStatusRoom ? 0 : 24}
              sm={!detailStatusRoom ? 0 : 24}
              md={16}
              lg={16}
              xl={18}
            >
              <Messenger handleOutRoom={handleOutRoom} />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
