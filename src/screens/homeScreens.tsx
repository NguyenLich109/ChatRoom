import Home from "../component/home";
import Sidebar from "../component/sidebar";

export default function HomeScreens() {
  return (
    <>
      <div className="home-flex">
        <Sidebar />
        <Home />
      </div>
    </>
  );
}
