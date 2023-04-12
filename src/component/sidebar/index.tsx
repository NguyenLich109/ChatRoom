import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
import { useAppSelector, useAppDispatch } from "../../redux/hookReudx";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getRooms, getUser, logOut, outRoom } from "../../redux/reducer";
import "../index.scss";

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const users = useAppSelector((state) => state.chatRoom.users);

  const [checkMenu, setCheckMenu] = useState<number>(1);

  // đăng xuát tài khoản
  const items: any = [
    {
      key: "1",
      label: `${users.name}`,
    },
  ];

  const logout: any = [
    {
      key: "1",
      label: `Đăng xuất`,
    },
  ];
  const onClick = () => {
    signOut(auth).then(() => {
      navigate("/login");
      dispatch(logOut());
    });
  };

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

  const navLinkStyle = ({ isActive }: any) => ({
    color: isActive ? "#fff" : "",
    backgroundColor: isActive ? "#006edc" : "",
  });

  return (
    <div className="memu-wrapper">
      <div className="memu-wrapper-user">
        <Dropdown
          menu={{
            items,
          }}
        >
          <img src={users.image}></img>
        </Dropdown>
      </div>
      <ul className="menu-list">
        <div>
          <li>
            <NavLink to="/" className="menu-list-icon" style={navLinkStyle}>
              <CommentOutlined />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/friend"
              className="menu-list-icon"
              style={navLinkStyle}
            >
              <UserOutlined />
            </NavLink>
          </li>
        </div>
        <Dropdown
          menu={{
            items: logout,
            onClick,
          }}
          className="menu-list-icon"
        >
          <SettingOutlined />
        </Dropdown>
      </ul>
    </div>
  );
}
