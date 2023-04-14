import { invoke } from "@tauri-apps/api/tauri";
import { getCurrent } from "@tauri-apps/api/window";
import { message } from "antd";

const initWin = () => {
  const currentWindow = getCurrent();
  console.log(currentWindow);
  invoke("set_window_always_on_top", {
    window: currentWindow,
    always_on_top: true,
    alwaysOnTop: true,
    decorations: true,
  });
  invoke("handle_custom_event");
};

const setBg = (bg: string) => {
  console.log(bg);
};
const cwd = (match: RegExpMatchArray | []) => {
  const currentCwd = match[1];
  console.log(currentCwd);
  if (currentCwd == "") {
    message.warning({ content: "请输入正确指令" });
  } else {
    switch (currentCwd) {
      case "who":
        message.success({
          content: "i am success!",
        });
        break;
      case "bg":
        setBg(currentCwd);
        break;
      default:
        message.warning({ content: "请输入正确指令" });
        break;
    }
  }
  // rest of the function code
};

export { initWin, cwd };
