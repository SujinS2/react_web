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

	public LoginMemberDTO refresh(String token) {
		try {
			LoginMemberDTO loginMember = jwtUtil.checkToken(token);
			String accessToken = jwtUtil.createAccessToken(loginMember.getMemberId(), loginMember.getMemberType());
			String refreshToken= jwtUtil.createRefreshToken(loginMember.getMemberId(), loginMember.getMemberType());
			loginMember.setAccessToken(accessToken);
			loginMember.setRefreshToken(refreshToken);
			return loginMember;
		} catch (Exception e) {
			// TODO: handle exception
		}
		return null;
	}

	public MemberDTO selectOneMember(String token) {
		try {
			//로그인시 받은 토큰을 검증한 후 회원아이디랑 등급을 추출해서 리턴받음
			LoginMemberDTO loginMember = jwtUtil.checkToken(token);
			//토큰해석으로 받은 아이디를 통해서 DB에서 회원정보 조회
			MemberDTO member = memberDao.selectOneMember(loginMember.getMemberId());
			member.setMemberPw(null); //암호화된 패스워드를 줄 필요가 없으므로
			return member;
		} catch (Exception e) {
			// TODO: handle exception
		}// TODO Auto-generated method stub
		return null;
	}
	@Transactional
	public int updateMember(MemberDTO member) {
		int result = memberDao.updateMember(member);
		return result;
	}

	public boolean checkPw(MemberDTO member) {
		MemberDTO m = memberDao.selectOneMember(member.getMemberId());
		if(m!=null && encoder.matches(member.getMemberPw(), m.getMemberPw())) {
			return true;
		}
		return false;
	}
	@Transactional
	public boolean changePw(MemberDTO member) {
		member.setMemberPw(encoder.encode(member.getMemberPw()));
		int result = memberDao.changePw(member);
		if(result>0) {
			return true;
		}else {
			return false;
		}
	}

	public boolean deleteMember(String token) {
		try {
			LoginMemberDTO member = jwtUtil.checkToken(token);
			int result = memberDao.deleteMember(member.getMemberId());
			if(result>0) {
				return true;
				}else {
				return false;
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		return false;
	}

}
