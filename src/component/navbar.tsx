import { useEffect } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Modal, Input } from "antd";
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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [nameRoom, setNameRoom] = useState<string>("");
  const [titleRoom, setTitleRoom] = useState<string>("");

  const showModal = () => {
    setIsModalOpen(true);
  };

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
          <span className="navbar-friend__span" onClick={showModal}>
            Tạo phòng: <PlusCircleOutlined />
          </span>
        </div>
        <div className="navbar-list">
          <span className="navbar-list__span">Danh sách phòng:</span>
          <ul>
            {listRoom.map((room) => {
              return (
                <li key={room.id} onClick={() => handleDetailRoom(room.id)}>
                  {room.nameRoom}
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
