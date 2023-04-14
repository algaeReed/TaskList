import { useEffect, useState } from "react";
import { Input, message } from "antd";
import dayjs from "dayjs";
import "./list.scss";
import { invoke } from "@tauri-apps/api/tauri";
import { getCurrent } from "@tauri-apps/api/window";
import { CloseCircleOutlined } from "@ant-design/icons";
import React from "react";
import { getStorageSync, setStorageSync } from "../../utils/storage";
import { guid } from "../../utils/guid";
import { TodoList } from "./TodoList";
import { cwd, initWin } from "./doIt";

function TaskList() {
  useEffect(() => {
    initWin();
  }, []);

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
    //inputValue首个字符串是冒号
    if (inputValue.trim().startsWith(":")) {
      console.log(inputValue);
      console.log(222);
      // Use regex to extract the string after the colon in inputValue
      const regex = /:(.*)/;
      const match = inputValue.trim().match(regex) ?? [];
      console.log(55555);

      cwd(match);
      return;
    }
    if (inputValue.trim() === "") return; // check if input is empty
    const newTodo: TodoList = {
      id: guid(),
      title: inputValue.trim(),
      content: "",
      time: dayjs().valueOf(),
      //dayjs 获取当前时间
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
            .sort((a: { time: number }, b: { time: number }) => a.time - b.time)
            .map((e: TodoList) => {
              return (
                <React.Fragment key={e.id}>
                  <div className={"cell"}>
                    <div className="todo" onClick={() => {}}>
                      {e.title}
                    </div>
                    <div className="time">
                      {dayjs(e.time).format("YY-MM-DD HH:mm:ss")}
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
export default TaskList;
