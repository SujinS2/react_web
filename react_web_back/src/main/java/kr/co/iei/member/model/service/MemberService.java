package kr.co.iei.member.model.service;



import kr.co.iei.member.model.dao.MemberDao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberService {
	@Autowired
	private MemberDao memberDao;
}
