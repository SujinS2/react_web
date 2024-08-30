import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginIdState, memberTypeState } from "../utils/RecoilData";
import { useRecoilState } from "recoil";

const Login = () => {
  //recoil 저장소에 접근하는 방법 (useRecoilState)==>recoil에서 만든 state와 연결해줌 해당 값의 getter setter를 여기로 가져왔다고? 보면 됨(내 주관적인 의견)
  const [loginId, setLoginId] = useRecoilState(loginIdState);
  const [memberType, setMemberType] = useRecoilState(memberTypeState);
  console.log(loginId);
  console.log(memberType);
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
  });
  const changeMember = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };
  //console.log(member);
  const login = () => {
    if (member.memberId === "" || member.memberPw === "") {
      Swal.fire({
        text: "아이디 또는 비밀번호를 입력하세요.",
        icon: "info",
      });
      return;
    }
    axios
      .post(`${backServer}/member/login`, member)
      .then((res) => {
        console.log(res);
        setLoginId(res.data.memberId);
        setMemberType(res.data.memberType);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          text: "아이디 또는 비밀번호를 확인하세요",
          icon: "warning",
          confirmButtonText: "다시 시도",
        });
      });
  };
  return (
    <section className="section login-wrap">
      <div className="page-title">로그인</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
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
            />
          </div>
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
        <div className="login-button-box">
          <button type="submit" className="btn-primary lg">
            로그인
          </button>
        </div>
        <div className="member-link-box">
          <Link to="/join">회원가입</Link>
          <Link to="#">아이디/ 비밀번호 찾기</Link>
        </div>
      </form>
    </section>
  );
};

export default Login;
