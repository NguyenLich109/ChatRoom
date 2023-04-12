import { useEffect } from "react";
import {
  PlusCircleOutlined,
  CommentOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Modal, Input, Button, Dropdown, Avatar, Tooltip } from "antd";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hookReudx";
import { addRoom, getdetailRoom, getRooms } from "../redux/reducer";
import { v4 as uuidv4 } from "uuid";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import "./navbar.scss";

export default function Navbar() {
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.chatRoom.users);
  const listRoom = useAppSelector((state) => state.chatRoom.chatRoom);
  const detailRoom = useAppSelector((state) => state.chatRoom.detailRoom);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [nameRoom, setNameRoom] = useState<string>("");
  const [titleRoom, setTitleRoom] = useState<string>("");

  const { Search } = Input;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const items: { key: string; label: string }[] = [
    {
      key: "1",
      label: "Tạo phòng",
    },
  ];

  const recall: { key: string; label: string }[] = [
    {
      key: "1",
      label: "Rời phòng",
    },
  ];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Room"), (listRooms) => {
      const arrs: any[] = [];
      listRooms.forEach((room) => {
        const findRoom = room
          .data()
          .roomFriend.some((friend: any) => friend.id === users.id);

        if (findRoom) {
          arrs.push(room.data());
        }
      });
      arrs.sort(({ createAt: a }, { createAt: b }) =>
        a > b ? 1 : a < b ? -1 : 0
      );
      dispatch(getRooms(arrs));
    });
    return () => {
      unsubscribe();
    };
  }, [dispatch, users]);

  const handleOk = () => {
    if (nameRoom && titleRoom) {
      dispatch(
        addRoom({
          nameRoom,
          titleRoom,
          id: uuidv4(),
          roomMaster: users.id,
          nameUsers: users.name,
          emailUser: users.email,
          imageUser: users.image,
        })
      );
      setIsModalOpen(false);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDetailRoom = (id: string) => {
    const unsub = onSnapshot(doc(db, "Room", id), (doc) => {
      if (doc.data()) {
        dispatch(getdetailRoom(doc.data()));
      }
    });
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-friend">
          <div className="navbar-flex">
            <Search
              placeholder="Tìm kiếm"
              className="header-search"
              // onSearch={onSearch}
            />
            <Button
              type="text"
              className="navbar-friend__span"
              onClick={showModal}
            >
              <Dropdown
                menu={{
                  items,
                }}
              >
                <PlusCircleOutlined />
              </Dropdown>
            </Button>
          </div>
          <span className="navbar-list__span">Tất cả</span>
        </div>
        <div className="navbar-list">
          <ul>
            {listRoom?.map((room) => {
              return (
                <li
                  className="navbar-room"
                  key={room.id}
                  style={
                    detailRoom.id === room.id
                      ? { backgroundColor: "#e5efff" }
                      : {}
                  }
                  onClick={() => {
                    handleDetailRoom(room.id);
                  }}
                >
                  <div className="navbar-room">
                    <div style={{ width: "56px" }}>
                      <Avatar.Group
                        maxCount={1}
                        size={room?.roomFriend.length > 1 ? "default" : "large"}
                        maxStyle={{
                          color: "#f56a00",
                          backgroundColor: "#fde3cf",
                        }}
                      >
                        {room?.roomFriend.map((friend: any, index: number) => {
                          return (
                            <Avatar key={index} src={friend.image}></Avatar>
                          );
                        })}
                      </Avatar.Group>
                    </div>
                    <div className="navbar-room__titile">
                      <span className="navbar-room__titile-span">
                        {room.nameRoom}
                      </span>
                      <span className="navbar-room__titile-span">
                        <CommentOutlined style={{ padding: "0 4px 0 0" }} />
                        {room.titleRoom}
                      </span>
                    </div>
                  </div>
                  <div>
                    <EllipsisOutlined style={{ fontSize: "1.85rem" }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div>
        <Modal
          title="Tạo phòng"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div>
            <label htmlFor="nameZoom">Tên phòng:</label>
            <Input
              onChange={(e) => setNameRoom(e.target.value)}
              type="text"
              id="nameZoom"
            ></Input>
          </div>
          <div>
            <label htmlFor="titleZoom">Tiêu đề:</label>
            <Input
              onChange={(e) => setTitleRoom(e.target.value)}
              type="text"
              id="titleZoom"
            ></Input>
          </div>
        </Modal>
      </div>
    </>
  );
}
