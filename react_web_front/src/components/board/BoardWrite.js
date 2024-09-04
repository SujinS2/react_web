import { useState } from "react";
import { useRecoilState } from "recoil";
import { loginIdState } from "../utils/RecoilData";
import BoardFrm from "./BoardFrm";
import ToastEditor from "../utils/ToastEditor";

const BoardWrite = () => {
  //글 작성시 전송할 데이터 선언
  const [loginId, setLoginId] = useRecoilState(loginIdState); // 로그인한 회원 아이디값(입력할게 아니기 때문에 state 사용 안함)
  const [boardTitle, setBoardTitle] = useState(""); //사용자가 입력할 제목
  const [thumbnail, setThumbnail] = useState(null); //썸네일은 첨부파일로 처리
  const [boardContent, setBoardContent] = useState(""); //사용자가 입력할 내용
  const [boardFile, setBoardFile] = useState([]); //첨부파일(여러개일 수 있으므로 배열로 처리)
  const inputTitle = (e) => {
    setBoardTitle(e.target.value);
  };
  //지금 필요없음(editor 사용시 달라지므로)
  //   const inputContent = (e) => {
  //     setBoardContent(e.target.value);
  //   };

  return (
    <section className="section board-content-wrap">
      <div className="page-title">게시글 작성</div>
      <form
        className="board-write-frm"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* 본문작성 뺀 나머지를 담당 */}
        <BoardFrm
          loginId={loginId}
          boardTitle={boardTitle}
          setBoardTitle={inputTitle}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          boardFile={boardFile}
          setBoardFile={setBoardFile}
        ></BoardFrm>
        <div className="board-content-wrap">
          <ToastEditor
            boardContent={boardContent}
            setBoardContent={setBoardContent}
          />
        </div>
      </form>
    </section>
  );
};
export default BoardWrite;
