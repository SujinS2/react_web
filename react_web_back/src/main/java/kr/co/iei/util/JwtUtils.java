package kr.co.iei.util;

import java.util.Calendar;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import kr.co.iei.member.model.dto.LoginMemberDTO;

@Component
public class JwtUtils {
	@Value("${jwt.secret-key}") //not lombok!
	public String secretKey;
	@Value("${jwt.expire-hour}")
	public int expireHour;
	@Value("${jwt.expire-hour-refresh}")
	public int expireHourRefresh;
	
	//1시간짜리 토큰 생성
	public String createAccessToken(String memberId, int memberType) {
		//1. 작성해둔 키값을 이용해서 암호화 코드 생성
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
		//2. 토큰 생성시간 및 만료시간 설정
		Calendar c = Calendar.getInstance();
		Date startTime = c.getTime();
		c.add(Calendar.HOUR, expireHour);
		Date expireTime = c.getTime();
		
		//토큰 생성
		String token = Jwts.builder()					//JWT 생성시작
							.issuedAt(startTime) 		//토큰 발생 시작시간
							.expiration(expireTime) 	//토큰만료 시간
							.signWith(key) 				//암호화 서명(담당자 도장찍은거와 비슷함)
							.claim("memberId", memberId)//토큰에 포함할 회원정보 세팅(key=value 구조)
							.claim("memberType", memberType)
							.compact();					//생성
		return token;
	}
	//8760시간(1년)짜리 accessToken이라 생각하면 됨
	public String createRefreshToken(String memberId, int memberType) {
		//1. 작성해둔 키값을 이용해서 암호화 코드 생성
				SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
				//2. 토큰 생성시간 및 만료시간 설정
				Calendar c = Calendar.getInstance();
				Date startTime = c.getTime();
				c.add(Calendar.HOUR, expireHourRefresh); //달라지는게 시간밖에 없음
				Date expireTime = c.getTime();
				
				//토큰 생성
				String token = Jwts.builder()					//JWT 생성시작
									.issuedAt(startTime) 		//토큰 발생 시작시간
									.expiration(expireTime) 	//토큰만료 시간
									.signWith(key) 				//암호화 서명(담당자 도장찍은거와 비슷함)
									.claim("memberId", memberId)//토큰에 포함할 회원정보 세팅(key=value 구조)
									.claim("memberType", memberType)
									.compact();					//생성
				return token;
	}
	
	//토큰을 받아서 확인
	public LoginMemberDTO checkToken(String token) {
		//1.토큰 해석을 위한 암호화 키 세팅
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
		Claims claims = (Claims) Jwts.parser()				//토큰 해석 시작
									.verifyWith(key)		//암호화 키
									.build()			
									.parse(token)
									.getPayload();
		String memberId = (String)claims.get("memberId");
		int memberType = (int)claims.get("memberType");
		LoginMemberDTO loginMember = new LoginMemberDTO();
		loginMember.setMemberId(memberId);
		loginMember.setMemberType(memberType);
		return loginMember;
									
	}
}
