import { Button, Avatar, Tooltip, Input, Dropdown, Alert, Image } from "antd";
import {
  AntDesignOutlined,
  UserOutlined,
  UserDeleteOutlined,
  UsergroupAddOutlined,
  PlusCircleOutlined,
  FileImageOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import "./index.scss";
import AddFriend from "../modal/addFriend";
import RemoveZoom from "../modal/removeZoom";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hookReudx";
import {
  inviteFriend,
  messageRecall,
  removeRoom,
  sendMessenger,
  suggestFriend,
} from "../../redux/reducer";
import { RoomFriend } from "../../redux/type";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export default function Messenger() {
  const dispatch = useAppDispatch();

  const detailRoom = useAppSelector((state) => state.chatRoom.detailRoom);
  const detailStatusRoom = useAppSelector(
    (state) => state.chatRoom.statusDetailRoom
  );
  const users = useAppSelector((state) => state.chatRoom.users);

  const [checkRemoveZoom, setCheckRemoveZoom] = useState<boolean>(false);
  const [checkFriend, setCheckFriend] = useState<boolean>(false);
  const [value, setValue] = useState<string[] | undefined>();
  const [content, setContent] = useState<string>("");
  const [url, setUrl] = useState<any>("");

  const items: any = [
    {
      key: "1",
      label: "Thu hồi",
    },
  ];

  //add image lên firebase
  useEffect(() => {
    const id: string = uuidv4();
    if (url) {
      const uploadTask = uploadBytes(ref(getStorage(), `images/${id}`), url, {
        contentType: "image/jpeg",
      }).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          const arr = {
            name: users.name,
            email: users.email,
            image: users.image,
            content,
            url: downloadURL,
            nameUrl: id,
            id: uuidv4(),
            createAt: new Date().getTime(),
          };
          dispatch(sendMessenger({ messenge: arr, id: detailRoom.id }));
          setUrl("");
        });
      });
    }
  }, [url]);

  const handleRemoveZoomOK = () => {
    if (users.id === detailRoom.roomMaster) {
      dispatch(removeRoom({ roomFriend: [], id: detailRoom.id }));
    } else {
      const filter = detailRoom.roomFriend.filter(
        (user: any) => users.id !== user.id
      );
      dispatch(removeRoom({ roomFriend: filter, id: detailRoom.id }));
    }
    setCheckRemoveZoom(false);
  };
  const handleRemoveZoomCancel = () => {
    setCheckRemoveZoom(false);
  };
  const handleFriendOK = (data: any) => {
    const { getSuggest, value } = data;
    const arrs: RoomFriend[] = [];
    value.forEach((detail: string) => {
      const findUser = getSuggest.find(
        (suggest: RoomFriend) => suggest.id === detail
      );
      if (findUser) {
        arrs.push(findUser);
      }
    });
    dispatch(inviteFriend({ values: arrs, id: detailRoom.id }));
    setCheckFriend(false);
  };
  const handleFrienCancel = () => {
    setCheckFriend(false);
  };

  const handleInvite = () => {
    setCheckFriend(true);
    setValue([]);
    dispatch(suggestFriend({ roomFriend: detailRoom.roomFriend }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const arr = {
      name: users.name,
      email: users.email,
      image: users.image,
      content,
      url,
      nameUrl: "",
      id: uuidv4(),
      createAt: new Date().getTime(),
    };
    if (content) {
      setContent("");
      dispatch(sendMessenger({ messenge: arr, id: detailRoom.id }));
    }
  };

  //thu hồi tin nhắn
  const handleRecall = ({
    idMessage,
    nameUrl,
  }: {
    idMessage: string;
    nameUrl: string;
  }) => {
    dispatch(messageRecall({ idRoom: detailRoom.id, idMessage, nameUrl }));
  };

  return (
    <>
      {!detailStatusRoom ? (
        <Alert message="Hãy chọn phòng" type="info" showIcon />
      ) : (
        <div className="messenger">
          <div className="messenger-header">
            <div className="messenger-header__noti">
              <p>{detailRoom?.nameRoom}</p>
              <p>{detailRoom?.titleRoom}</p>
            </div>
            <div className="messenger-header__friend">
              <Button type="text" onClick={() => setCheckRemoveZoom(true)}>
                <UserDeleteOutlined /> Rời phòng
              </Button>
              <RemoveZoom
                handleRemoveZoomOK={handleRemoveZoomOK}
                handleRemoveZoomCancel={handleRemoveZoomCancel}
                checkRemoveZoom={checkRemoveZoom}
              />
              <Button type="text" onClick={handleInvite}>
                <UsergroupAddOutlined />
                Mời bạn
              </Button>
              <AddFriend
                handleFriendOK={handleFriendOK}
                handleFrienCancel={handleFrienCancel}
                optionCheck={{ checkFriend, value }}
              />
              <Avatar.Group
                maxCount={3}
                size="small"
                maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
              >
                {detailRoom?.roomFriend.map((friend: any, index: number) => {
                  return (
                    <Tooltip key={index} title={friend.name} placement="top">
                      <Avatar src={friend.image}></Avatar>
                    </Tooltip>
                  );
                })}
              </Avatar.Group>
            </div>
          </div>
          <div className="messenger-container">
            {detailRoom.messenges?.map((friend: any, index: number) => {
              return (
                <div
                  key={index}
                  className="messenger-user"
                  style={
                    friend.email !== users.email
                      ? { justifyContent: "flex-start" }
                      : {}
                  }
                >
                  {friend.email === users.email ? (
                    <Dropdown
                      className="messenger-user-icon"
                      menu={{
                        items,
                        onClick: () =>
                          handleRecall({
                            idMessage: friend.id,
                            nameUrl: friend.nameUrl,
                          }),
                      }}
                    >
                      <EllipsisOutlined />
                    </Dropdown>
                  ) : (
                    <img className="image-icon" src={friend.image} alt="img" />
                  )}
                  <div className="messenger-user-contai">
                    {friend.email !== users.email && <p>{friend.name}</p>}
                    <p
                      style={
                        friend.content === "Tin nhắn đã được thu hồi"
                          ? { color: "#888585" }
                          : {}
                      }
                    >
                      {friend.content}
                    </p>
                    {friend.url && <Image width={150} src={friend.url} />}
                    <span>
                      Lúc {new Date(friend.createAt).getHours()}:
                      {new Date(friend.createAt).getMinutes()} Ngày{" "}
                      {new Date(friend.createAt).getDate()}-
                      {new Date(friend.createAt).getMonth() + 1}-
                      {new Date(friend.createAt).getFullYear()}
                    </span>
                  </div>
                  {friend.email === users.email && (
                    <img className="image-icon" src={friend.image} alt="img" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="messenger-zoom__footer">
            <label htmlFor="" style={{ padding: "0 5px 0 10px" }}>
              <Avatar.Group style={{ cursor: "pointer" }}>
                <Tooltip title="Thêm" placement="top">
                  <Avatar
                    shape="square"
                    style={{
                      backgroundColor: "#45bd62",
                      borderRadius: "50px",
                    }}
                    icon={<PlusCircleOutlined />}
                  />
                </Tooltip>
              </Avatar.Group>
            </label>
            <label htmlFor="files">
              <Avatar.Group style={{ cursor: "pointer" }}>
                <Tooltip title="Ảnh" placement="top">
                  <Avatar
                    shape="square"
                    style={{ backgroundColor: "#45bd62" }}
                    icon={<FileImageOutlined />}
                  />
                </Tooltip>
              </Avatar.Group>
            </label>
            <input
              onChange={(e: any) => setUrl(e.target.files[0])}
              style={{ display: "none" }}
              id="files"
              type="file"
            ></input>
            <form onSubmit={handleSubmit}>
              <Input
                onChange={(e) => setContent(e.target.value)}
                value={content}
                style={{ backgroundColor: "#f0f2f5" }}
                placeholder="Aa"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
