package kr.co.iei.member.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias(value="member")
@Schema(description = "회원 객체")
public class MemberDTO {
	@Schema(description = "회원 아이디", type = "string")
	private String memberId;
	@Schema(description = "회원 비밀번호", type = "string")
	private String memberPw;
	@Schema(description = "회원 이름", type = "string")
	private String memberName;
	@Schema(description = "회원 전화번호", type = "string")
	private String memberPhone;
	@Schema(description = "회원 분류번호", type = "number")
	private int memberType;
}
