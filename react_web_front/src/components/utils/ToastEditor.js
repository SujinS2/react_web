import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import axios from "axios";
import { useRef } from "react";
const ToastEditor = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const boardContent = props.boardContent;
  const setBoardContent = props.setBoardContent;
  const editorRef = useRef(null);
  const changeValue = () => {
    const editorData = editorRef.current.getInstance().getHTML();
    setBoardContent(editorData);
    // console.log(boardContent);
  };
  const uploadImg = (file, callbackFunc) => {
    //사진을 업로드하고 ok버튼을 누르면 매개변수로 해당 file이 들어옴
    //업로드끝나고 받아온 파일을 가져오는 함수(2번째 매개변수)
    //비동기요청으로 이미지파일을 업로드하고, 업로드된 파일의 경로를 결과로 받아옴
    const form = new FormData();
    form.append("image", file);
    axios
      .post(`${backServer}/board/editorImage`, form, {
        headers: {
          contentType: "multipart/form/data",
          processData: false,
        },
      })
      .then((res) => {
        console.log(res);
        callbackFunc(`${backServer}${res.data}`, "이미지");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
      {boardContent || boardContent === "" ? (
        <Editor
          ref={editorRef}
          initialValue={boardContent}
          initialEditType="wysiwyg"
          language="ko-KR"
          height="600px"
          onChange={changeValue}
          hooks={{
            addImageBlobHook: uploadImg,
          }}
        ></Editor>
      ) : (
        ""
      )}
    </div>
  );
};
export default ToastEditor;
