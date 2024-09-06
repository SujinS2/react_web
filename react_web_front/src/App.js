import { Route, Routes } from "react-router-dom";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import Main from "./components/common/Main";
import Join from "./components/member/Join";
import Login from "./components/member/Login";
import { useEffect, useState } from "react";
import axios from "axios";
import { loginIdState, memberTypeState } from "./components/utils/RecoilData";
import { useRecoilState } from "recoil";
import MemberMain from "./components/member/MemberMain";
import BoardMain from "./components/board/BoardMain";
import AdminMain from "./components/admin/AdminMain";
import ChatMain from "./components/utils/ChatMain";

function App() {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [loginId, setLoginId] = useRecoilState(loginIdState);
  const [memberType, setMemberType] = useRecoilState(memberTypeState);
  useEffect(() => {
    refreshLogin();
    window.setInterval(refreshLogin, 60 * 60 * 1000); //한시간이 지나면 로그인 정보 자동으로 refresh 될수 있게
  }, []);
  //로그인 재요청
  const refreshLogin = () => {
    //최초화면 접속하면 LocalStorage에 저장된 refreshToken을 가져와서 자동으로 로그인 처리
    const refreshToken = window.localStorage.getItem("refreshToken");
    console.log(refreshToken);
    // 한번도 로그인하지 않았거나, 로그아웃을 했으면 refreshToken은 존재하지 않음==>아무행동도 하지 않을것
    if (refreshToken != null) {
      //존재하면 해당 토큰으로 다시 로그인 처리
      axios.defaults.headers.common["Authorization"] = refreshToken;
      axios
        .post(`${backServer}/member/refresh`)
        .then((res) => {
          console.log(res);
          //refresh 토큰을 전송해서 로그인 정보를 새로 갱신해옴
          setLoginId(res.data.memberId);
          setMemberType(res.data.memberType);
          axios.defaults.headers.common["Authorization"] = res.data.accessToken;
          window.localStorage.setItem("refreshToken", res.data.refreshToken);
        })
        .catch((err) => {
          console.log(err);
          setLoginId("");
          setMemberType(0);
          delete axios.defaults.headers.common["Authorization"];
          window.localStorage.removeItem("refreshToken");
        });
    }
  };
  return (
    <div className="wrap">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/join" element={<Join />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/member/*" element={<MemberMain />}></Route>
          {/* /member/info, /member/changePw 등등 모두 MemberMain으로 갈수있도록 */}
          <Route path="/board/*" element={<BoardMain />}></Route>
          <Route path="/admin/*" element={<AdminMain />}></Route>
          <Route path="/chat" element={<ChatMain />}></Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
