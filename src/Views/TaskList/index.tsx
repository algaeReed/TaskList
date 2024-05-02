import { CloseCircleOutlined } from "@ant-design/icons";
import { Input } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { guid } from "../../utils/guid";
import { getStorageSync, setStorageSync } from "../../utils/storage";
import { cwd, initWin } from "./doIt";
import "./list.scss";
import { TodoList } from "./TodoList";

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
    if (inputValue.trim() === "") return; // check if input is empty

    //inputValue首个字符串是冒号
    if (inputValue.trim().startsWith(":")) {
      // Use regex to extract the string after the colon in inputValue
      const regex = /:(.*)/;
      const match = inputValue.trim().match(regex) ?? [];
      cwd(match);
      return;
    }
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
