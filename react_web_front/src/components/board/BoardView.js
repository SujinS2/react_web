import { Viewer } from "@toast-ui/react-editor";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { loginIdState } from "../utils/RecoilData";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";

const BoardView = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useRecoilState(loginIdState);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const boardNo = params.boardNo;
  const [board, setBoard] = useState({});
  useEffect(() => {
    axios
      .get(`${backServer}/board/boardNo/${boardNo}`)
      .then((res) => {
        console.log(res);
        setBoard(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const deleteBoard = () => {
    Swal.fire({
      title: "정말 지울거야?",
      icon: "question",
      iconColor: "var(--main2)",
      showCancelButton: true,
      cancelButtonText: "취소",
      confirmButtonText: "삭제",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(`${backServer}/board/${board.boardNo}`)
          .then((res) => {
            console.log(res);
            if (res.data) {
              Swal.fire({
                title: "삭제 완료",
                icon: "success",
              }).then(() => {
                navigate("/board/list");
              });
            } else {
              Swal.fire({
                title: "삭제 실패..",
                icon: "error",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  return (
    <section className="section board-view-wrap">
      <div className="page-title">게시글</div>
      <div className="board-view-content">
        <div className="board-view-info">
          <div className="board-thumbnail">
            <img
              src={
                board.boardThumb
                  ? `${backServer}/board/thumb/${board.boardThumb}`
                  : "/image/default_img.png"
              }
            />
          </div>
          <div className="board-view-preview">
            <table className="tbl">
              <tbody>
                <tr>
                  <td className="left" colSpan={4}>
                    {board.boardTitle}
                  </td>
                </tr>
                <tr>
                  <th style={{ width: "20%" }}>작성자</th>
                  <td style={{ width: "30%" }}>{board.boardWriter}</td>
                  <th style={{ width: "20%" }}>작성일</th>
                  <td style={{ width: "30%" }}>{board.boardDate}</td>
                </tr>
              </tbody>
            </table>
            <p className="file-title">첨부파일</p>
            <div className="file-zone">
              {board.fileList
                ? board.fileList.map((file, i) => {
                    return <FileItem key={"file_" + i} file={file} />;
                  })
                : ""}
            </div>
          </div>
        </div>
        {/* <div
          className="board-content-wrap"
          //@기본적으로 모두 text로 받음>>html로 했을때 위험을 감수해야하기 때문에:위험감수하고 싶으면 이렇게..!
                  //html 로 저장된 데이터를 화면에 띄울때는 {}문법이 아니라 속성을 이용해서 표현
                  //하지만 우리의 editor는 전용 view를 제공함
          dangerouslySetInnerHTML={{ __html: board.boardContent }}
        ></div> */}
        <div className="board-content-wrap">
          {board.boardContent ? (
            <Viewer initialValue={board.boardContent} />
          ) : (
            ""
          )}
        </div>
        {loginId === board.boardWriter ? (
          <div className="view-btn-zone">
            <Link
              to={`/board/update/${board.boardNo}`}
              className="btn-primary lg"
            >
              수정
            </Link>
            <button
              type="button"
              className="btn-secondary lg"
              onClick={deleteBoard}
            >
              삭제
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

const FileItem = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const file = props.file;
  const filedown = () => {
    axios
      .get(`${backServer}/board/file/${file.boardFileNo}`, {
        //axios 는 기본적으로 응답을 json으로 처리
        //현재 요청은 일반적인 json 타입의 응답을 받으려는게 아니라 파일을 받아야 함
        //=>일반적인 json으로 처리 불가능하므로 파일로 결과를 받는 설정이 따로 필요
        responseType: "blob",
      })
      .then((res) => {
        console.log(res);
        //서버에서 받은 데이터를 javascript의 Blob 객체로 변환
        const blob = new Blob([res.data]);
        //@가상의 a 태그 만들어서 연결해서 다운받고 a태그 삭제하는 과정
        //blob데이터를 이용해서 데이터 객체 url생성(다운로드할 수 있는 링크)
        const fileObjectUrl = window.URL.createObjectURL(blob);

        //데이터를 다운로드할링크 생성
        const link = document.createElement("a");
        link.href = fileObjectUrl; //a태그의 href에 우리가 만든 url링크 넣기
        link.style.display = "none"; // 안보이도록
        //다운로드할 파일명 지정
        link.download = file.filename;
        //파일이랑 연결한 a태그를 문서에 포함
        document.body.appendChild(link);
        link.click(); //추가한 a 태그를 클릭해서 다운로드
        link.remove(); //다운로드끝난후 a태그 삭제
        window.URL.revokeObjectURL(fileObjectUrl); //파일 링크 삭제
      })
      .catch((err) => {
        console.log(err);
      });
    //데이터를 가져오는 것이므로 get
  };
  return (
    <div className="board-file">
      <span className="material-icons file-icon" onClick={filedown}>
        file_download
      </span>
      <span className="file-name">{file.filename}</span>
    </div>
  );
};
export default BoardView;
