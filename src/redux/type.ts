export interface Messenge {
  name: string;
  image: string;
  email: string;
  content: string;
  url: string;
  nameUrl: string;
  id: string;
  createAt: number;
}

export interface RoomFriend {
  name: string;
  email: string;
  image: string;
  id: string;
}

export interface Users {
  name: string;
  email: string;
  image: string;
  id: string;
}

export interface Roomchat {
  nameRoom: string;
  titleRoom: string;
  roomFriend: RoomFriend[];
  roomMaster: string;
  messenges: Messenge[];
  id: string;
  createAt: number;
}
