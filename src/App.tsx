import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Card, Input, InputRef } from "antd";
import dayjs from 'dayjs';
import { getStorageSync, setStorageSync } from "./utils/storage";
import { guid } from "./utils/guid";
import "./dist/list.css";
import { invoke } from '@tauri-apps/api/tauri';
import { getCurrent } from '@tauri-apps/api/window'
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
function App () {
  const [list, setList] = useState<any>([]);

  const [inputValue, setInputValue] = useState<any>("");
  const [inputValueId, setInputValueId] = useState<any>("");
  const inputRef = useRef<InputRef>(null);

  const [cover, setCover] = useState<any>(false)
  useEffect(() => {
    const currentWindow = getCurrent();
    console.log(currentWindow)
    invoke('set_window_always_on_top', {
      window: currentWindow,
      always_on_top: true,
      alwaysOnTop: true,
      decorations: true

    });
    invoke('handle_custom_event',);
  }, []);


  useEffect(() => {
    let _list = getStorageSync("_list");
    console.log(_list);
    if (_list) {
      _list = JSON.parse(_list);
      setList(_list);
    }
  }, []);

  useEffect(() => {
    // if (list == 0) {
    //   setStorageSync("_list", JSON.stringify([]));
    // }
    if (list && list.length > 0) {
      setStorageSync("_list", JSON.stringify(list));
    }

  }, [list]);
  const handleDetete = (id: string) => {
    console.log(id)
    const newList = list.filter((item: any) => item.id !== id);
    console.log(newList)
    setList(newList);
  }; const handleOnPressEnter = (e: any) => {

    if (inputValueId) {
      const newList = list.map((item: any) => {
        if (item.id === inputValueId.id) {
          return { ...item, value: e.target.value };
        }
        return item;
      });
      setList(newList);
      setInputValueId({});
      setInputValue("")
      return;
    }

    console.log(e.target.value)
    if (!e.target.value) {
      return
    }
    list && list.length > 0
      ? setList([...list, { id: guid(), value: e.target.value, time: dayjs().format('YYYY-MM-DD HH:mm:ss') }])
      : setList([{ id: guid(), value: e.target.value, time: dayjs().format('YYYY-MM-DD HH:mm:ss') }]);
    dayjs(1)
    setInputValue("")
  }

  const handleClickValue = (value: any) => {
    console.log(value)
    setInputValue(value.value)
    setInputValueId({
      id: value.id
    })
    setCover(true)
    handleAutoFocus()
  }

  const handleAutoFocus = () => {
    inputRef.current!.focus({
      cursor: 'start',
    });
  }
  return (
    <div className="container" >

      < div className="top" data-tauri-drag-region>
        <div className="menu" >
          {/* 1 */}
        </div>
        <div className="input">
          <Input placeholder="..." onPressEnter={handleOnPressEnter} allowClear ref={inputRef}
            onChange={(e) => {
              console.log(e)
              setInputValue(e.target.value);
            }}
            value={inputValue}
          />
        </div>
      </div>
      < div className="main" data-tauri-drag-region>

        <div className="list" >
          {
            list.sort((a: { time: any; }, b: { time: string; }) => b.time.localeCompare(a.time)).map((e: { value: string; time: string; id: string }) => {
              return <>
                <div className={"cell"} key={e.id}>
                  <div className="todo" onClick={() => {
                    handleClickValue(e)
                  }}>
                    {e.value}
                  </div>
                  <div className="time">
                    {e.time}
                    <div className="icon"
                      onClick={() => {
                        handleDetete(e.id)
                      }}>
                      <CloseCircleOutlined />
                    </div>

                  </div>
                </div>
              </>
            })
          }
        </div>
      </div >
    </div >
  );
}
export default App;
