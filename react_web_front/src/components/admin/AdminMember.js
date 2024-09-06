import axios from "axios";
import { useEffect, useState } from "react";
import PageNavi from "../utils/PageNavi";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const AdminMember = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [memberList, setMemberList] = useState([]);
  const [pi, setPi] = useState({});
  const [reqPage, setReqPage] = useState(1);
  useEffect(() => {
    axios
      .get(`${backServer}/admin/member/${reqPage}`)
      .then((res) => {
        setMemberList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);

  return (
    <>
      <div className="page-title">회원관리</div>
      <div className="admin-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: "20%" }}>아이디</th>
              <th style={{ width: "20%" }}>이름</th>
              <th style={{ width: "30%" }}>전화번호</th>
              <th style={{ width: "30%" }}>회원등급</th>
            </tr>
          </thead>
          <tbody>
            {memberList.map((member, index) => {
              const changeType = (memberType) => {
                member.memberType = memberType;
                setMemberList([...memberList]);
              };
              return (
                <MemberItem
                  key={"member" + index}
                  member={member}
                  changeType={changeType}
                />
              );
            })}
          </tbody>
        </table>
        <div className="admin-page-wrap" style={{ marginTop: "30px" }}>
          <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
        </div>
      </div>
    </>
  );
};

const MemberItem = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const member = props.member;
  const changeType = props.changeType;
  const handleChange = (e) => {
    axios
      .patch(`${backServer}/admin/member`, {
        memberId: member.memberId,
        memberType: e.target.value,
      })
      .then((res) => {
        console.log(res);
        if (res.data) {
          changeType(e.target.value);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <tr>
      <td>{member.memberId}</td>
      <td>{member.memberName}</td>
      <td>{member.memberPhone}</td>
      <td>
        <Select
          style={{ width: "150px", height: "50px" }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={member.memberType}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={1}>관리자</MenuItem>
          <MenuItem value={2}>일반회원</MenuItem>
        </Select>
      </td>
    </tr>
  );
};
export default AdminMember;
