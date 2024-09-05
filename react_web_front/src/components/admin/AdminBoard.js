import axios from "axios";
import { useEffect, useState } from "react";
import PageNavi from "../utils/PageNavi";
import Switch from "@mui/material/Switch";

const AdminBoard = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [boardList, setBoardList] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState({});
  useEffect(() => {
    axios
      .get(`${backServer}/admin/board/${reqPage}`)
      .then((res) => {
        console.log(res);
        setBoardList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);
  return (
    <>
      <div className="page-title">게시글 관리</div>
      <table className="tbl">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>글번호</th>
            <th style={{ width: "40%" }}>제목</th>
            <th style={{ width: "15%" }}>작성자</th>
            <th style={{ width: "15%" }}>작성일</th>
            <th style={{ width: "20%" }}>공개여부</th>
          </tr>
        </thead>
        <tbody>
          {boardList.map((board, index) => {
            const changeStatus = (boardStatus) => {
              board.boardStatus = boardStatus;
              setBoardList([...boardList]);
            };
            return (
              <BoardItem
                key={"board" + index}
                board={board}
                changeStatus={changeStatus}
              />
            );
          })}
        </tbody>
      </table>
      <div className="admin-page-wrap">
        <PageNavi reqPage={reqPage} setReqPage={setReqPage} pi={pi} />
      </div>
    </>
  );
};
const BoardItem = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const board = props.board;
  const changeStatus = props.changeStatus;
  const handleChange = () => {
    const boardStatus = board.boardStatus === 1 ? 2 : 1;
    //db작업, 그 후에 성공하면 화면에 반영
    //axios 요청
    axios
      .patch(`${backServer}/admin/board`, {
        boardNo: board.boardNo,
        boardStatus: boardStatus,
      })
      .then((res) => {
        console.log(res);
        if (res.data) {
          changeStatus(boardStatus);
        }
      });
  };

  return (
    <tr>
      <td>{board.boardNo}</td>
      <td>{board.boardTitle}</td>
      <td>{board.boardWriter}</td>
      <td>{board.boardDate}</td>
      <td>
        <Switch
          checked={board.boardStatus === 1} //1이면 true, 아니면 false
          onChange={handleChange}
        />
      </td>
    </tr>
  );
};
export default AdminBoard;
