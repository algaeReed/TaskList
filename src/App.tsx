import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Input } from "antd";
import dayjs from "dayjs";
import { getStorageSync, setStorageSync } from "./utils/storage";
import { guid } from "./utils/guid";
import "./styles.css";
import { invoke } from "@tauri-apps/api/tauri";
import { getCurrent } from "@tauri-apps/api/window";
import { CloseCircleOutlined } from "@ant-design/icons";
import React from "react";

function App() {
  useEffect(() => {
    const currentWindow = getCurrent();
    console.log(currentWindow);
    invoke("set_window_always_on_top", {
      window: currentWindow,
      always_on_top: true,
      alwaysOnTop: true,
      decorations: true,
    });
    invoke("handle_custom_event");
  }, []);

  interface TodoList {
    id: string;
    title: string;
    content?: string;
    time: string;
  }
  [];

  const [todo, setTodo] = useState<TodoList[]>(
    JSON.parse(getStorageSync("_list") || "[]")
  );

  const [inputValue, setInputValue] = useState("");

  function handleDetete(id: string) {
    const newTodo = todo.filter((e) => e.id !== id);
    setTodo(newTodo);
    setStorageSync("_list", JSON.stringify(newTodo));
  }
  function handleOnPressEnter() {
    if (inputValue.trim() === "") return; // check if input is empty
    const newTodo: TodoList = {
      id: guid(),
      title: inputValue.trim(),
      content: "",
      time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
    setTodo([...todo, newTodo]);
    setStorageSync("_list", JSON.stringify([...todo, newTodo]));
    setInputValue(""); // clear input after adding todo
  }

  return (
    <div className="container">
      <div className="top" data-tauri-drag-region>
        <div className="menu">{/* 1 */}</div>
        <div className="input">
          <Input
            placeholder="..."
            allowClear
            onPressEnter={handleOnPressEnter}
            onChange={(e) => {
              console.log(e);
              setInputValue(e.target.value);
            }}
            value={inputValue}
          />
        </div>
      </div>
      <div className="main" data-tauri-drag-region>
        <div className="list">
          {todo
            .sort((a: { time: string }, b: { time: string }) =>
              b.time.localeCompare(a.time)
            )
            .map((e: TodoList) => {
              return (
                <React.Fragment key={e.id}>
                  <div className={"cell"}>
                    <div className="todo" onClick={() => {}}>
                      {e.title}
                    </div>
                    <div className="time">
                      {e.time}
                      <div
                        className="icon"
                        onClick={() => {
                          handleDetete(e.id);
                        }}
                      >
                        <CloseCircleOutlined />
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </div>
  );
}
export default App;
