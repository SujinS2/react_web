import { useRef, useState } from "react";

const BoardFrm = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const loginId = props.loginId;
  const boardFile = props.boardFile;
  const setBoardFile = props.setBoardFile;
  const thumbnail = props.thumbnail;
  const setThumbnail = props.setThumbnail;
  const boardTitle = props.boardTitle;
  const setBoardTitle = props.setBoardTitle;
  const thumbnailRef = useRef(null); //react에서 특정한 요소 선택하고 싶을때 사용하던거
  //썸네일 미리보기용 state(데이터 전송하지 않음)
  const [boardImg, setBoardImg] = useState(null);
  //썸네일 이미지 첨부파일이 변경되면 동작할 함수
  const changeThumbnail = (e) => {
    const files = e.currentTarget.files;
    //currentTarget:요소들이 겹쳐있을 경우에 해당 요소를 선택할 때에는 이벤트버블링이 생길수도 있기 때문에
    //target이 아닌 currentTarget 사용(target 사용시 여러요소가 한번에 선택)
    if (files.length !== 0 && files[0] !== 0) {
      //썸네일 파일 객체를 글 작성 시 전송하기 위한 값 저장
      setThumbnail(files[0]);
      //화면에 썸네일 미리보기
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setBoardImg(reader.result);
      };
    } else {
      setThumbnail(null);
      setBoardImg(null);
    }
  };
  //첨부파일 화면에 띄울 state
  const [showBoardFile, setShowBoardFile] = useState([]);

  const addBoardFile = (e) => {
    // console.log(e); //뭔지 보고 잡아서..
    const files = e.currentTarget.files; //배열 아니라서 map 못씀(주의)
    const fileArr = new Array(); //글 작성시 전송할 파일 배열
    const filenameArr = new Array(); //화면에 노출시킬 파일 이름 배열
    for (let i = 0; i < files.length; i++) {
      fileArr.push(files[i]);
      filenameArr.push(files[i].name);
    }
    setBoardFile([...boardFile, ...fileArr]);
    setShowBoardFile([...showBoardFile, ...filenameArr]);
  };
  //console.log(boardFile);
  //console.log(showBoardFile);

  //수정인 경우에 추가로 전송되는 데이터
  const boardThumb = props.boardThumb;
  const setBoardThumb = props.setBoardThumb;
  const fileList = props.fileList;
  const setFileList = props.setFileList;
  const delBoardFileNo = props.delBoardFileNo;
  const setDelBoardFileNo = props.setDelBoardFileNo;

  return (
    <div>
      <div className="board-thumb-wrap">
        {boardImg ? (
          <img
            src={boardImg}
            onClick={() => {
              thumbnailRef.current.click();
            }}
          ></img>
        ) : boardThumb ? (
          <img
            src={`${backServer}/board/thumb/${boardThumb}`}
            onClick={() => {
              thumbnailRef.current.click();
            }}
          />
        ) : (
          <img
            src="/image/default_img.png"
            onClick={() => {
              thumbnailRef.current.click();
            }}
          />
        )}
        <input
          ref={thumbnailRef}
          type="file"
          name=""
          id=""
          accept="image/*"
          style={{ display: "none" }}
          onChange={changeThumbnail}
        />
      </div>
      <div className="board-info-wrap">
        <table className="tbl">
          <tbody>
            <tr>
              <th style={{ width: "30%" }}>
                <label htmlFor="boardTitle">제목</label>
              </th>
              <td>
                <div className="input-item">
                  <input
                    type="text"
                    id="boardTitle"
                    name="boardTitle"
                    value={boardTitle}
                    onChange={setBoardTitle}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>작성자</th>
              <td className="left">{loginId}</td>
            </tr>
            <tr>
              <th>
                <label htmlFor="boardFile">첨부파일</label>
              </th>
              <td className="left">
                <label htmlFor="boardFile" className="btn-primary sm">
                  파일첨부
                </label>
                <input
                  type="file"
                  name="boardFile"
                  id="boardFile"
                  multiple
                  style={{ display: "none" }}
                  onChange={addBoardFile}
                />
              </td>
            </tr>
            <tr>
              <th>첨부파일 목록</th>
              <td>
                <div className="board-file-wrap">
                  {fileList
                    ? fileList.map((boardFile, i) => {
                        const deleteFile = () => {
                          setFileList([
                            //화면에 반영
                            ...fileList.filter((item) => {
                              return item !== boardFile;
                            }),
                          ]);
                          setDelBoardFileNo([
                            //controller로 전송하기 위해 배열에 추가
                            ...delBoardFileNo,
                            boardFile.boardFileNo,
                          ]);
                        };
                        return (
                          <p key={"oldFile" + i}>
                            <span className="filename">
                              {boardFile.filename}
                            </span>
                            <span
                              className="material-icons del-file-icon"
                              onClick={deleteFile}
                            >
                              delete
                            </span>
                          </p>
                        );
                      })
                    : ""}
                  {showBoardFile.map((filename, i) => {
                    const deleteFile = () => {
                      boardFile.splice(i, 1);
                      setBoardFile([...boardFile]);
                      showBoardFile.splice(i, 1);
                      setShowBoardFile([...showBoardFile]);
                    };
                    return (
                      <p key={"newFile-" + i}>
                        <span className="filename">{filename}</span>
                        <span
                          className="material-icons del-file-icon"
                          onClick={deleteFile}
                        >
                          delete
                        </span>
                      </p>
                    );
                  })}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default BoardFrm;
