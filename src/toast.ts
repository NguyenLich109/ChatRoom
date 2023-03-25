import { notification } from "antd";
type Type = "success" | "error";
interface Info {
  type: Type;
  message: string;
  duration: number;
}

export const Toast = ({ type, message, duration }: Info) => {
  notification[type]({
    duration: duration,
    message: message,
  });
};
