const PageNavi = (props) => {
  const pi = props.pi;
  const setReqPage = props.setReqPage;
  const reqPage = props.reqPage;
  //paging jsx가 저장될 배열 선언
  const arr = new Array();
  //제일 앞으로
  arr.push(
    <li key={"first-page"}>
      <span
        className="material-icons page-item"
        onClick={() => {
          setReqPage(1);
        }}
      >
        first_page
      </span>
    </li>
  );
  //이전 페이지(필요하다면)
  //   arr.push(
  //     <li key={"prev-page"}>
  //       <span
  //         className="material-icons page-item"
  //         onClick={() => {
  //           if (reqPage !== 1) {
  //             setReqPage(1);
  //           }
  //         }}
  //       >
  //         navigate_before
  //       </span>
  //     </li>
  //   );

  //페이징 숫자
  let pageNo = pi.pageNo;
  for (let i = 0; i < pi.pageNaviSize; i++) {
    arr.push(
      <li key={"page" + i}>
        <span
          onClick={(e) => {
            setReqPage(Number(e.target.innerText));
          }}
          className={"page-item" + (pageNo === reqPage ? " active-page" : "")}
        >
          {pageNo}
        </span>
      </li>
    );
    pageNo++;
    if (pageNo > pi.totalPage) {
      break;
    }
  }
  //   //다음 페이지
  //   arr.push(
  //     <li key={"next-page"}>
  //       <span
  //         onClick={() => {
  //           if (reqPage !== pi.totalPage) {
  //             setReqPage(reqPage + 1);
  //           }
  //         }}
  //         className="material-icons page-item"
  //       >
  //         navigate_next
  //       </span>
  //     </li>
  //   );
  //마지막 페이지
  arr.push(
    <li key={"last-page"}>
      <span
        className="material-icons page-item"
        onClick={() => {
          setReqPage(pi.totalPage);
        }}
      >
        last_page
      </span>
    </li>
  );
  return <ul className="pagination">{arr}</ul>;
};
export default PageNavi;
