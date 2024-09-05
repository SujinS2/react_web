import { Route, Routes } from "react-router-dom";
import BoardList from "./BoardList";
import "./board.css";
import BoardWrite from "./BoardWrite";
import BoardView from "./BoardView";
import BoardUpdate from "./BoardUpdate";
const BoardMain = () => {
  return (
    <Routes>
      <Route path="list" element={<BoardList />}></Route>
      <Route path="write" element={<BoardWrite />}></Route>
      <Route path="view/:boardNo" element={<BoardView />}></Route>
      <Route path="update/:boardNo" element={<BoardUpdate />}></Route>
    </Routes>
  );
};
export default BoardMain;
