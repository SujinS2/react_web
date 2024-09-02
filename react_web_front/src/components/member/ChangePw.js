import { useRecoilState } from "recoil";
import { loginIdState } from "../utils/RecoilData";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ChangePw = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [loginId, setLoginId] = useRecoilState(loginIdState);
  const [member, setMember] = useState({
    memberId: loginId,
    memberPw: "",
  });
  useEffect(() => {
    //새로고침 처리
    setMember({ ...member, memberId: loginId });
  }, [loginId]);
  const [memberPwRe, setMemberPwRe] = useState("");
  const [isAuth, setIsAuth] = useState(false); //.현재 비밀번호 인증이 되었는지
  const changeMemberPw = (e) => {
    setMember({ ...member, memberPw: e.target.value });
  };
  const pwCheck = () => {
    axios
      .post(`${backServer}/member/pw`, member)
      .then((res) => {
        console.log(res);
        if (res.data) {
          setIsAuth(true);
          //memberState 를 재사용하기 위해서 비밀번호값 초기화
          setMember({ ...member, memberPw: "" });
        } else {
          Swal.fire({
            title: "비밀번호를 확인하세요",
            icon: "question",
            iconColor: "var(--main2)",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const changePw = () => {
    if (member.memberPw === memberPwRe) {
      axios
        .patch(`${backServer}/member/pw`, member)
        .then((res) => {
          console.log(res);
          if (res.data) {
            Swal.fire({
              title: "비밀번호 변경이 완료되었습니다",
              icon: "success",
            }).then(() => {
              setIsAuth(false);
              setMember({ ...member, memberPw: "" });
              setMemberPwRe("");
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Swal.fire({
        title: "비밀번호가 일치하지 않습니다.",
        icon: "info",
        iconColor: "var(--main2)",
      });
    }
  };
  return (
    <>
      <div className="page-title">비밀번호 변경</div>
      <div style={{ width: "60%", margin: "0 auto" }}>
        {isAuth ? (
          <>
            <div className="input-wrap" style={{ marginBottom: "50px" }}>
              <div className="input-title">
                <label htmlFor="newPw">새 비밀번호</label>
              </div>
              <div className="input-item">
                <input
                  type="password"
                  name="newPw"
                  id="newPw"
                  value={member.memberPw}
                  onChange={changeMemberPw}
                />
              </div>
            </div>
            <div className="input-wrap">
              <div className="input-title">
                <label htmlFor="newPwRe">비밀번호 확인</label>
              </div>
              <div className="input-item">
                <input
                  type="password"
                  name="newPwRe"
                  id="newPwRe"
                  value={memberPwRe}
                  onChange={(e) => {
                    setMemberPwRe(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="button-zone">
              <button
                type="button"
                className="btn-primary lg"
                onClick={changePw}
              >
                변경하기
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="input-wrap">
              <div className="input-title">
                <label htmlFor="oldPw">기존 비밀번호 입력</label>
              </div>
              <div className="input-item">
                <input
                  type="password"
                  name="oldPw"
                  id="oldPw"
                  value={member.memberPw}
                  onChange={changeMemberPw}
                />
              </div>
            </div>
            <div className="button-zone">
              <button
                type="button"
                className="btn-primary lg"
                onClick={pwCheck}
              >
                확인
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChangePw;
