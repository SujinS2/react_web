package kr.co.iei.member.model.service;



import kr.co.iei.member.model.dao.MemberDao;
import kr.co.iei.member.model.dto.LoginMemberDTO;
import kr.co.iei.member.model.dto.MemberDTO;
import kr.co.iei.util.JwtUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberService {
	@Autowired
	private MemberDao memberDao;
	@Autowired
	private BCryptPasswordEncoder encoder;
	@Autowired
	private JwtUtils jwtUtil;
	
	@Transactional
	public int insertMember(MemberDTO member) {
		member.setMemberPw(encoder.encode(member.getMemberPw()));
		int result = memberDao.insertMember(member);
		// TODO Auto-generated method stub
		return result;
	}

	public boolean checkId(String memberId) {
		// TODO Auto-generated method stub
		boolean result = memberDao.checkId(memberId);
		return !result;
	}

	public LoginMemberDTO login(MemberDTO member) {
		// TODO Auto-generated method stub
		MemberDTO m = memberDao.selectOneMember(member.getMemberId());
//		if(m!=null) {
//			if(encoder.matches(member.getMemberPw(), m.getMemberPw())) {
//				return m;
//			}
//		}
		//또는
		if(m!= null && encoder.matches(member.getMemberPw(), m.getMemberPw())) {
			String accessToken = jwtUtil.createAccessToken(m.getMemberId(), m.getMemberType());
			String refreshToken = jwtUtil.createRefreshToken(m.getMemberId(), m.getMemberType());
			LoginMemberDTO loginMemberDTO = new LoginMemberDTO(accessToken, refreshToken, m.getMemberId(), m.getMemberType());
			return loginMemberDTO;
		}
		return null;
	}
}
