import { useRef, useState } from "react";
import "./member.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Join = () => {
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  //.env 파일에서 해당 이름을 가진 변수 값을 문자타입으로 가져옴(REACT_APP까지는 이름이 고정)
  const join = () => {
    if (idCheck === 1 && pwMessage.current.classList.contains("valid")) {
      axios
        .post(`${backServer}/member`, member)
        .then((res) => {
          console.log(res);
          navigate("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Swal.fire({
        text: "입력 값을 확인하세요",
        icon: "info",
      });
    }
  };
  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
    memberName: "",
    memberPhone: "",
  });
  const changeMember = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };
  const changePwRe = (e) => {
    setMemberPwRe(e.target.value);
  };
  const [memberPwRe, setMemberPwRe] = useState("");
  //아이디 중복체크 결과에 따라서 바뀔 state
  //0:아직 입력하지 않은 상태(검사 안한 상태), 1:정규표현식, 중복체크 모두 통과한 경우(정상)
  //2:정규표현식을 만족하지 못한 상태
  //3:아이디가 중복인 경우
  const [idCheck, setIdCheck] = useState(0);
  const checkId = () => {
    //아이디 유효성 검사
    //1. 정규표현식 검사
    //2. 정규표현식 검사 성공하면, DB에 중복체크
    const idReg = /^[a-zA-Z0-9]{4,8}$/;
    if (!idReg.test(member.memberId)) {
      setIdCheck(2);
    } else {
      //우리는 하나의 회원정보를 조회하려는게 아니라 있는지 여부를 체크하는것 뿐이므로 주소에 /check-id 추가
      axios
        .get(`${backServer}/member/memberId/${member.memberId}/check-id`)
        .then((res) => {
          if (res.data) {
            setIdCheck(1);
          } else {
            setIdCheck(3);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  //비밀번호와 비밀번호 확인이 같은지 체크해 메세지 출력
  //react는 요소를 선택할 때 document.querySelector 방식(real dom 사용)을 권고하지 않음
  //반면 react는 즉각적인 반응을 위해 virtual dom을 이용하기 때문에
  //=> useRef 훅을 이용해서 요소와 연결해서 사용
  const pwMessage = useRef(null);
  //생성한 useRef를 연결하고 싶은 태그의 ref 속성에 적어줌으로써 연결
  //연결되면 해당 객체의 current 속성이 dom 객체를 의미함

  const checkPw = () => {
    pwMessage.current.classList.remove("valid");
    pwMessage.current.classList.remove("invalid");
    if (member.memberPw === memberPwRe) {
      console.log("비밀번호 일치");
      pwMessage.current.classList.add("valid");
      pwMessage.current.innerText = "비밀번호가 일치합니다."; //.current : 해당 돔객체
    } else {
      console.log("일치하지 않을 때");
      pwMessage.current.classList.add("invalid");
      pwMessage.current.innerText = "비밀번호가 일치하지 않습니다.";
    }
  };
  return (
    <section className="section join-wrap">
      <div className="page-title">회원가입</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          join();
        }}
      >
        <div className="input-wrap">
          <div className="input-title">
            <label htmlFor="memberId">아이디</label>
          </div>
          <div className="input-item">
            <input
              type="text"
              name="memberId"
              id="memberId"
              value={member.memberId}
              onChange={changeMember}
              onBlur={checkId} //아이디 인풋을 나가면 실행
            />
          </div>
          <p
            className={
              "input-msg" +
              (idCheck === 0 ? "" : idCheck === 1 ? " valid" : " invalid")
            }
          >
            {idCheck === 0
              ? ""
              : idCheck === 1
              ? "사용가능한 아이디입니다"
              : idCheck === 2
              ? "아이디는 영어 대/소문자, 숫자로 4~8 글자로 되어야 합니다"
              : "이미 사용중인 아이디입니다."}
          </p>
        </div>
        <div className="input-wrap">
          <div className="input-title">
            <label htmlFor="memberPw">비밀번호</label>
          </div>
          <div className="input-item">
            <input
              type="password"
              name="memberPw"
              id="memberPw"
              value={member.memberPw}
              onChange={changeMember}
            />
          </div>
        </div>
        <div className="input-wrap">
          <div className="input-title">
            <label htmlFor="memberPwRe">비밀번호 확인</label>
          </div>
          <div className="input-item">
            <input
              type="password"
              name="memberPwRe"
              id="memberPwRe"
              value={memberPwRe}
              onChange={changePwRe}
              onBlur={checkPw}
            />
          </div>
          <p className="input-msg" ref={pwMessage}></p>
        </div>
        <div className="input-wrap">
          <div className="input-title">
            <label htmlFor="memberName">이름</label>
          </div>
          <div className="input-item">
            <input
              type="text"
              name="memberName"
              id="memberName"
              value={member.memberName}
              onChange={changeMember}
            />
          </div>
        </div>
        <div className="input-wrap">
          <div className="input-title">
            <label htmlFor="memberPhone">전화번호</label>
          </div>
          <div className="input-item">
            <input
              type="text"
              name="memberPhone"
              id="memberPhone"
              value={member.memberPhone}
              onChange={changeMember}
            />
          </div>
        </div>
        <div className="join-button-box">
          <button type="submit" className="btn-primary lg">
            회원가입
          </button>
        </div>
      </form>
    </section>
  );
};
export default Join;
