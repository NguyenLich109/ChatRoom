import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
  getDocs,
  collection,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { auth, db } from "../firebase/config";
import {
  createAction,
  createAsyncThunk,
  createReducer,
} from "@reduxjs/toolkit";
import { Messenge, Roomchat, RoomFriend, Users } from "./type";
import { Toast } from "../toast";
import { getStorage, ref, deleteObject } from "firebase/storage";

interface InitalState {
  users: Users;
  chatRoom: Roomchat[];
  suggestRoom: RoomFriend[];
  detailRoom: any;
  statusLogin: boolean;
  statusGetUser: boolean;
  statusRoom: boolean;
  statusDetailRoom: boolean;
}

const initalState: InitalState = {
  users: { name: "", email: "", image: "", id: "" },
  chatRoom: [],
  suggestRoom: [],
  detailRoom: {},
  statusLogin: false,
  statusGetUser: false,
  statusRoom: false,
  statusDetailRoom: false,
};

// add login
export const login = createAsyncThunk(
  "chatRoom/login",
  async ({ name, email, image, id }: any) => {
    const data = await getDoc(doc(db, "users", id));
    if (!data.data()) {
      await setDoc(doc(db, "users", id), {
        name,
        email,
        image,
        id,
      });
    }
    return true;
  }
);

//get room
export const getUser = createAsyncThunk(
  "chatRoom/getUser",
  async (data: any) => {
    return data;
  }
);

// add room
export const addRoom = createAsyncThunk(
  "chatRoom/addRoom",
  async (data: {
    nameRoom: string;
    titleRoom: string;
    id: string;
    roomMaster: string;
    nameUsers: string;
    emailUser: string;
    imageUser: string;
  }) => {
    await setDoc(doc(db, "Room", data.id), {
      nameRoom: data.nameRoom,
      titleRoom: data.titleRoom,
      roomFriend: [
        {
          name: data.nameUsers,
          email: data.emailUser,
          image: data.imageUser,
          id: data.roomMaster,
        },
      ],
      roomMaster: data.roomMaster,
      messenges: [],
      id: data.id,
      createAt: new Date().getTime(),
    });

    return true;
  }
);

//get Rooms
export const getRooms = createAsyncThunk(
  "chatRoom/getRooms",
  async (data: any) => {
    return data;
  }
);
// get detail Room
export const getdetailRoom = createAsyncThunk(
  "chatRoom/detailRoom",
  async (data: any) => {
    return data;
  }
);
//get gợi ý bạn bè muốn mồi chát nhóm
export const suggestFriend = createAsyncThunk(
  "chatRoom/suggest",
  async (data: { roomFriend: RoomFriend[] }) => {
    const arrs: any = [];
    const listUser = await getDocs(collection(db, "users"));
    listUser.forEach((user) => {
      const finduser = data.roomFriend.some(
        (friend) => friend.id === user.data().id
      );
      if (!finduser) {
        arrs.push(user.data());
      }
    });
    return arrs;
  }
);

// mời bạn bè vào phòng
export const inviteFriend = createAsyncThunk(
  "chatRoom/inviteFriend",
  async ({ values, id }: { values: RoomFriend[]; id: string }) => {
    const room: any = (await getDoc(doc(db, "Room", id))).data();
    const arrs: RoomFriend[] = [...room.roomFriend, ...values];

    await updateDoc(doc(db, "Room", id), {
      roomFriend: arrs,
    });
  }
);

// rời phòng
export const removeRoom = createAsyncThunk(
  "chatRoom/removeRoom",
  async ({ roomFriend, id }: { roomFriend: RoomFriend[]; id: string }) => {
    if (roomFriend.length === 0) {
      await deleteDoc(doc(db, "Room", id));
    } else {
      await updateDoc(doc(db, "Room", id), {
        roomFriend: roomFriend,
      });
    }
  }
);
// chat meesenger
export const sendMessenger = createAsyncThunk(
  "chatRoom/sendMessenger",
  async ({ messenge, id }: { messenge: Messenge; id: string }) => {
    const room: any = (await getDoc(doc(db, "Room", id))).data();
    await updateDoc(doc(db, "Room", id), {
      messenges: [...room.messenges, messenge],
    });
  }
);

//thu hồi tin nhắn
export const messageRecall = createAsyncThunk(
  "chatRoom/messageRecall",
  async ({
    idRoom,
    idMessage,
    nameUrl,
  }: {
    idRoom: string;
    idMessage: string;
    nameUrl: string;
  }) => {
    if (nameUrl) {
      deleteObject(ref(getStorage(), `images/${nameUrl}`)).then(() => {
        // File deleted successfully
      });
    }
    const room: any = (await getDoc(doc(db, "Room", idRoom))).data();
    const index = room.messenges.findIndex(
      (message: Messenge) => message.id === idMessage
    );
    room.messenges[index].content = "Tin nhắn đã được thu hồi";
    room.messenges[index].nameUrl = "";
    room.messenges[index].url = "";

    await updateDoc(doc(db, "Room", idRoom), {
      messenges: room.messenges,
    });
  }
);

// đăng xuất tài khoản
export const logOut = createAsyncThunk("chatRoom/logOut", async () => {
  return true;
});

// reder reducer
const reducer = createReducer(initalState, (builder) => {
  builder.addCase(login.fulfilled, (state, action) => {
    if (action.payload) {
      Toast({ type: "success", message: "Đăng nhập thành công", duration: 3 });
    }
  });
  builder.addCase(getUser.pending, (state, action) => {
    state.statusGetUser = true;
  });
  builder.addCase(getUser.fulfilled, (state, action) => {
    state.statusGetUser = false;
    state.users = {
      name: action.payload.name,
      email: action.payload.email,
      image: action.payload.image,
      id: action.payload.id,
    };
  });
  builder.addCase(addRoom.fulfilled, (state, action) => {
    if (action.payload) {
      Toast({ type: "success", message: "Tạo phòng thành công", duration: 3 });
    }
  });
  builder.addCase(addRoom.rejected, (state, action) => {
    if (action.payload) {
      Toast({
        type: "error",
        message: "Tạo phòng không thành công",
        duration: 3,
      });
    }
  });
  builder.addCase(inviteFriend.fulfilled, (state, action) => {
    Toast({
      type: "success",
      message: "Mời bạn thành công",
      duration: 3,
    });
  });
  builder.addCase(removeRoom.fulfilled, (state, action) => {
    Toast({
      type: "success",
      message: "Rời phòng thành công",
      duration: 3,
    });
    state.statusDetailRoom = false;
  });
  builder.addCase(getRooms.fulfilled, (state, action) => {
    if (action.payload) {
      state.chatRoom = action.payload;
    }
  });
  builder.addCase(getdetailRoom.fulfilled, (state, action) => {
    if (action.payload) {
      state.detailRoom = action.payload;
      state.statusDetailRoom = true;
    }
  });
  builder.addCase(suggestFriend.fulfilled, (state, action) => {
    state.suggestRoom = action.payload;
  });
  builder.addCase(logOut.fulfilled, (state, action) => {
    state.chatRoom = [];
    state.users = { name: "", email: "", image: "", id: "" };
    state.suggestRoom = [];
    state.detailRoom = {};
    state.statusLogin = false;
    state.statusGetUser = false;
    state.statusRoom = false;
    state.statusDetailRoom = false;
  });
});

export default reducer;
