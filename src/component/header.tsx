import { useEffect, useState } from "react";
import { Input, Space, Button, Dropdown } from "antd";
import { Toast } from "../toast";
import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hookReudx";
import "./index.scss";
import { logOut } from "../redux/reducer";

const { Search } = Input;
export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.chatRoom.users);

  const items: any = [
    {
      key: "1",
      label: `${users.name} | Đăng xuất`,
    },
  ];
  const onClick = () => {
    signOut(auth).then(() => {
      navigate("/login");
      dispatch(logOut());
    });
  };

  return (
    <>
      <div className="header">
        <div className="header-global col-gird">
          <div className="header-logo">
            <h2 style={{ color: "#00bcd4" }}>ChatRoom</h2>
            <Search
              placeholder="Search"
              className="header-search"
              // onSearch={onSearch}
            />
          </div>
          <div className="header-user">
            <Dropdown
              menu={{
                items,
                onClick,
              }}
            >
              <img src={users.image}></img>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
}
