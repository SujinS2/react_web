import { Route, Routes } from "react-router-dom";
import BoardList from "./BoardList";
import "./board.css";
import BoardWrite from "./BoardWrite";
const BoardMain = () => {
  return (
    <Routes>
      <Route path="list" element={<BoardList />}></Route>
      <Route path="write" element={<BoardWrite />}></Route>
    </Routes>
  );
};
export default BoardMain;
