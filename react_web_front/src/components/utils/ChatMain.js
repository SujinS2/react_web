import { useRecoilState, useRecoilValue } from "recoil";
import "./chat.css";
import { isLoginState, loginIdState } from "./RecoilData";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const ChatMain = () => {
  const isLogin = useRecoilValue(isLoginState);
  const [loginId, setLoginId] = useRecoilState(loginIdState);
  const [ws, setWs] = useState({});
  const [chatList, setChatList] = useState([]);
  const [btnStatus, setBtnStatus] = useState(true); //버튼 상태(disabled=true여야 비활성화이므로)
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const socketServer = backServer.replace("http://", "ws://"); //
  useEffect(() => {
    if (loginId !== "") {
      const socket = new WebSocket(`${socketServer}/allChat`);
      setWs(socket);
      return () => {
        //해당 컴포넌트에서 다른 컴포넌트로 바뀔때 동작?
        //console.log("이거 보여?");
        socket.close();
      };
    }
  }, [loginId]);

  const [chatMsg, setChatMsg] = useState({
    type: "enter",
    memberId: loginId,
    message: "",
  });

  useEffect(() => {
    if (chatMsg.message === "") {
      setBtnStatus(true);
    }
  }, [chatMsg]);
  chatMsg.memberId = loginId === "" ? "" : loginId;
  const inputMsg = (e) => {
    const checkValue = e.target.value.replaceAll("\n", ""); //엔터를 빈문자로 바꿈
    if (chatMsg.message === "" && checkValue === "") {
      //chatMsg.message : 방금 입력한게 반영되기 전 상태/ checkValue : 반영된거 중 엔터를 빈문자로 바꾼상태
      setBtnStatus(true);
      return;
    }
    setChatMsg({ ...chatMsg, message: e.target.value });
    if (e.target.value === "") {
      setBtnStatus(true);
    } else {
      setBtnStatus(false);
    }
  };
  const sendMessage = () => {
    //소켓 사이의 데이터는 문자열만 가능하므로 우리가 보낼 chatMsg(Json 데이터)를 문자열로 변환
    const data = JSON.stringify(chatMsg);
    ws.send(data); //웹소켓 객체의 send함수가 서버쪽으로 웹소켓을 통해서 데이터를 전송(단, 객체가 아닌 문자로 바꾼 타입을 넣어줘야함을 명심)
    setChatMsg({ ...chatMsg, message: "" });
    setBtnStatus(true); // 다시 버튼 비활성화
  };
  //@백에서 함수 3개를 만든것처럼 여기서도 3개 만들것 >>ws에 연결해줘야함
  //소켓 연결하면 실행되는 함수 지정
  //서버에서 데이터를 받으면 처리할 함수 지정
  //소켓 연결이 끊어지면 실행되는 함수 지정
  const startChat = () => {
    console.log("웹소켓 연결시 실행되는 함수");
    const data = JSON.stringify(chatMsg);
    ws.send(data);
    setChatMsg({ ...chatMsg, type: "chat" }); //제일 처음 들어왔을때와 채팅일때를 구분
  };
  const receiveMsg = (receiveData) => {
    // console.log("서버에서 데이터를 받으면 실행되는 함수");
    //   console.log(receiveData);
    //서버가 보낸 문자열을 받아서 객체로 변환
    const data = JSON.parse(receiveData.data);
    console.log(data);
    setChatList([...chatList, data]);
  };
  const endChat = () => {
    console.log("웹소켓 연결이 끊어지면 실행되는 함수");
  };

  //console.log(loginId);
  ws.onopen = startChat;
  ws.onmessage = receiveMsg;
  ws.onclose = endChat;

  const chatDiv = useRef(null);
  useEffect(() => {
    if (chatDiv.current) {
      chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
    }
  }, [chatList]);
  const inputKeyboard = (e) => {
    if (e.keyCode === 13 && !e.shiftKey && chatMsg.message !== "") {
      //쉬프트 엔터는 제외, 아무것도 안썼을때는 전송 안됨
      sendMessage();
    }
  };
  return (
    <section className="section chat-wrap">
      <div className="page-title">전체회원 채팅</div>
      {isLogin ? (
        <div className="chat-content-wrap">
          <div className="chat-message-area" ref={chatDiv}>
            {chatList.map((chat, index) => {
              return (
                <Chatting key={"chat" + index} chat={chat} memberId={loginId} />
              );
            })}
          </div>
          <div className="message-input-box">
            <div className="input-item">
              <textarea
                name=""
                id="chat-message"
                value={chatMsg.message}
                onChange={inputMsg}
                onKeyUp={inputKeyboard}
              ></textarea>
              <button
                className={btnStatus ? "btn-secondary" : "btn-primary"}
                onClick={btnStatus ? null : sendMessage}
                //   버튼이 disabled이면 함수도 없음
                disabled={btnStatus}
              >
                전송
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="login-info-box">
          <h3>로그인 후 이용 가능합니다</h3>
          <Link to="/login">로그인 페이지로 이동</Link>
        </div>
      )}
    </section>
  );
};

const Chatting = (props) => {
  const chat = props.chat;
  const memberId = props.memberId;

  return (
    <>
      {chat.type === "enter" ? (
        <p className="info">
          <span>{chat.memberId}</span>님이 입장하셨습니다.
        </p>
      ) : chat.type === "out" ? (
        <p className="info">
          <span>{chat.memberId}</span>님이 퇴장하셨습니다.
        </p>
      ) : (
        <div
          className={chat.memberId === memberId ? "chat right" : "chat left"}
        >
          <div className="user">
            <span className="material-icons user">account_circle</span>
            <span className="name">{chat.memberId}</span>
          </div>
          <div className="chat-message">{chat.message}</div>
        </div>
      )}
    </>
  );
};
export default ChatMain;
