import { useEffect, useState } from "react";
import { Input, Space, Button, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hookReudx";
import "./index.scss";
import { logOut } from "../redux/reducer";

const { Search } = Input;
export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.chatRoom.users);

  return (
    <>
      <div className="header">
        <div className="header-global col-gird">
          <div className="header-logo">
            <h2 style={{ color: "#00bcd4" }}>ChatRoom</h2>
          </div>
        </div>
      </div>
    </>
  );
}
