import Friends from "../component/friend";
import Sidebar from "../component/sidebar";

export default function FriendScreens() {
  return (
    <>
      <div className="home-flex">
        <Sidebar />
        <Friends />
      </div>
    </>
  );
}
