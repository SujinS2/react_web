import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loginIdState } from "../utils/RecoilData";
import { useRecoilState } from "recoil";
import BoardFrm from "./BoardFrm";
import ToastEditor from "../utils/ToastEditor";

const BoardUpdate = () => {
  const navigate = useNavigate();
  const params = useParams();
  const boardNo = params.boardNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  //썸네일 파일을 새로 전송하기 위한 state
  const [thumbnail, setThumbnail] = useState(null);
  //첨부파일을 새로 전송하기 위햔 state
  const [boardFile, setBoardFile] = useState([]);
  //조회해온 썸네일을 화면에 보여주기 위한 state
  const [boardThumb, setBoardThumb] = useState(null);
  //조회해온 파일 목록을 화면에 보여주기 위한 state
  const [fileList, setFileList] = useState([]);
  //기존 첨부파일을 삭제하면 삭제한 파일번호를 저장할 배열
  const [delBoardFileNo, setDelBoardFileNo] = useState([]);

  useEffect(() => {
    axios
      .get(`${backServer}/board/boardNo/${boardNo}`)
      .then((res) => {
        console.log(res);
        setBoardTitle(res.data.boardTitle);
        setBoardContent(res.data.boardContent);
        // setBoardFile([...res.data.fileList]);
        // setThumbnail(res.data.boardThumb);
        //=>js 파일객체를 받기 위해 만든 객체이므로 다른 곳에 넣는다
        setBoardThumb(res.data.boardThumb);
        setFileList(res.data.fileList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const inputTitle = (e) => {
    setBoardTitle(e.target.value);
  };
  const [loginId, setLoginId] = useRecoilState(loginIdState);

  //업데이트할 함수
  const updateBoard = () => {
    // console.log(boardTitle);
    // console.log(boardContent);
    // console.log(thumbnail);
    // console.log(boardFile);
    // console.log(delBoardFileNo);
    // console.log(boardNo);

    if (boardTitle !== "" && boardContent !== "") {
      const form = new FormData();
      form.append("boardTitle", boardTitle);
      form.append("boardContent", boardContent);
      form.append("boardNo", boardNo);
      if (boardThumb !== null) {
        form.append("boardThumb", boardThumb); // 기존 값 추가(있을 수도 있고, 없을 수도 있음)
        //null인 상태에서 append=> 문자열 null로 감(따라서 null이 아닐때만 들어갈 수 있도록 if)
      }
      if (thumbnail !== null) {
        form.append("thumbnail", thumbnail);
      }
      for (let i = 0; i < boardFile.length; i++) {
        form.append("boardFile", boardFile[i]);
      }
      for (let i = 0; i < delBoardFileNo.length; i++) {
        form.append("delBoardFileNo", delBoardFileNo[i]);
      }
      axios
        .patch(`${backServer}/board`, form, {
          headers: {
            contentType: "multipart/form-data",
            processData: false,
          },
        })
        .then((res) => {
          if (res.data) {
            navigate(`/board/view/${boardNo}`);
          }
        });
    }
  };
  return (
    <section className="section board-content-wrap">
      <div className="page-title">게시글 수정</div>
      <form
        className="board-write-frm"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <BoardFrm
          loginId={loginId}
          boardTitle={boardTitle}
          setBoardTitle={inputTitle}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          boardFile={boardFile}
          setBoardFile={setBoardFile}
          setBoardThumb={setBoardThumb}
          boardThumb={boardThumb}
          fileList={fileList}
          setFileList={setFileList}
          delBoardFileNo={delBoardFileNo}
          setDelBoardFileNo={setDelBoardFileNo}
        />
        <div className="board-content-wrap">
          <ToastEditor
            boardContent={boardContent}
            setBoardContent={setBoardContent}
            type={1}
          />
        </div>
        <div className="button-zone">
          <button className="btn-primary lg" onClick={updateBoard}>
            수정
          </button>
        </div>
      </form>
    </section>
  );
};
export default BoardUpdate;
