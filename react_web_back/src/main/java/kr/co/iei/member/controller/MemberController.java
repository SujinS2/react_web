package kr.co.iei.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.iei.member.model.dao.MemberDao;
import kr.co.iei.member.model.dto.LoginMemberDTO;
import kr.co.iei.member.model.dto.MemberDTO;
import kr.co.iei.member.model.service.MemberService;
import kr.co.iei.util.JwtUtils;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/member")
@Tag(name = "MEMBER", description = "MEMBER API")
public class MemberController {
	@Autowired
	private MemberService memberService;

	@Operation(summary = "회원 가입", description = "회원 아이디, 비밀번호, 이름, 전화번호 받아서 회원가입")
	@PostMapping
	public ResponseEntity<Integer> join(@RequestBody MemberDTO member) {
		int result = memberService.insertMember(member);
		if (result > 0) {
			return ResponseEntity.ok(result);
		} else {
			return ResponseEntity.status(500).build(); // 만약에 다른 메세지를 주고 싶다면: status에 500(에러코드) 담아서 만들어서 보내달라
		}
	}

	@Operation(summary = "아이디 중복 체크", description = "아이디를 받아서 해당 아이디가 이미 있는지 체크-있으면 false, 없으면 true return")
	@GetMapping(value = "/memberId/{memberId}/check-id")
	public ResponseEntity<Boolean> checkId(@PathVariable String memberId) {
		boolean result = memberService.checkId(memberId);
		return ResponseEntity.ok(result);
	}

	@Operation(summary = "로그인", description = "아이디, 비밀번호를 받아서 일치하는 회원이 있으면 로그인처리")
	@PostMapping(value = "/login")
	public ResponseEntity<LoginMemberDTO> login(@RequestBody MemberDTO member) {
		LoginMemberDTO loginMember = memberService.login(member);
		if (loginMember != null) {
			return ResponseEntity.ok(loginMember);
		} else {
			return ResponseEntity.status(404).build();
		}
	}

	@PostMapping(value = "/refresh")
	public ResponseEntity<LoginMemberDTO> refresh(@RequestHeader("Authorization") String token) {
		// System.out.println(token);
		LoginMemberDTO loginMember = memberService.refresh(token);
		if (loginMember != null) {
			return ResponseEntity.ok(loginMember);
		} else {
			return ResponseEntity.status(404).build();
		}
	}
	
	@Operation(summary="회원 1명 정보 조회", description = "")
	@GetMapping
	public ResponseEntity<MemberDTO> selectOneMember(@RequestHeader("Authorization")String token) {
		try {
			Thread.sleep(500);
		} catch (Exception e) {
			// TODO: handle exception
		}
		MemberDTO member = memberService.selectOneMember(token);
		return ResponseEntity.ok(member);
	}

	@Operation(summary = "회원 정보 수정", description = "멤버 객체를 받아 이름, 전화번호 수정")
	@PatchMapping
	public ResponseEntity<Integer> updateMember(@RequestBody MemberDTO member) {
		int result = memberService.updateMember(member);
		return ResponseEntity.ok(result);

	}
	
	@PostMapping(value="/pw")
	public ResponseEntity<Boolean> checkPw(@RequestBody MemberDTO member){
		boolean result = memberService.checkPw(member);
		return ResponseEntity.ok(result);
	}
	
	@Operation(summary = "회원 비밀번호 변경", description = "멤버객체를 받아서 비밀번호 수정")
	@PatchMapping(value = "/pw")
	public ResponseEntity<Boolean> changePw(@RequestBody MemberDTO member){
		boolean result = memberService.changePw(member);
		return ResponseEntity.ok(result);
	}
	
	@DeleteMapping
	public ResponseEntity<Boolean> deleteMember(@RequestHeader("Authorization") String token){
		boolean result = memberService.deleteMember(token);
		return ResponseEntity.ok(result);
	}
}
