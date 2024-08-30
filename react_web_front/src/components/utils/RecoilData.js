//Recoil을 이용해서 전체 애플리케이션에서 사용할 데이터 선언
//로그인 정보는 특정컴포넌트가 아니라 애플리케이션 전체적으로 영향을 줌
//=> 관련 데이터를 App 컴포너느에 선언하고 계속 전달(매우 힘든 작업)
//기존 server-side rendering(ssr)에서 session 역할을 recoil이 대신 수행==> 서버는 더이상 상태를 갖지 않을 것이므로(session을 사용하지 않음)

import { atom, selector } from "recoil";

//atom: 데이터를 저장할 수 있음
//selector : 존재하는 데이터를 이용해서 함수에서 데이터를 편집하여 리턴할 수 있음

//외부에서 데이터를 저장하거나 또는 사용하고 싶은 경우 atom==>사용시 useRecoilState()사용 : state 타입으로 리턴
//외부에서 특정 데이터를 통한 특정 연산결과를 도출하고 싶으면 selector==>사용시 useRecoilValue() 사용 : 함수에서 리턴하는 데이터 타입 리턴

//로그인한 아이디를 저장하는 저장소
const loginIdState = atom({
  key: "loginIdState", //loginIdState를 요청했을때, default에 들어있는 값을 줄 수 있음
  default: "",
});
//로그인한 회원 타입을 저장하는 저장소
const memberTypeState = atom({
  key: "memberTypeState",
  default: 0,
});

//atom으로 생성한 데이터로 처리하는 함수
const isLoginState = selector({
  key: "isLoginState",
  get: (state) => {
    //default가 아닌 get, 여기에 함수를 적는다
    //매개변수 state는 recoil 저장된 데이터를 불러오기 위한 객체
    //미리 만들어진 LoginIdState에 값 가져옴(get 함수 통해서)
    const loginId = state.get(loginIdState);
    //미리 만들어진 memberTypeState의 값 가져옴
    const memberType = state.get(memberTypeState);
    //로그인 여부=> loginIdState가 빈문자열이 아니고 memberTypeState값이 0이 아닌 경우
    return !(loginId === "" || memberType === 0);
  },
});

export { loginIdState, memberTypeState, isLoginState };
//recoil은 session보다 폐쇄적; 이런식으로 설정해놓은 것만 저장할 수 있음
