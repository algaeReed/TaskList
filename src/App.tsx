import { ConfigProvider } from "antd";
import TaskList from "./Views/TaskList";

function App() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBgContainer: "transparent",
          },
        },
      }}
    >
      <TaskList />
    </ConfigProvider>
  );
}
export default App;
