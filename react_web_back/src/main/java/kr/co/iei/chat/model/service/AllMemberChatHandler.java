package kr.co.iei.chat.model.service;

import java.util.HashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.iei.chat.model.dto.ChatDTO;

@Component
public class AllMemberChatHandler extends TextWebSocketHandler{
	//웹소켓 : 보통 웹이 한번 접속해서 request, response를 받으면 close/ 반면 웹소켓은 그대로 통로를 열어둠
	
	//전체채팅에 접속한 회원정보를 저장한 collection
	private HashMap<WebSocketSession, String> members;
	
	public AllMemberChatHandler() {
		super();
		members = new HashMap<WebSocketSession, String>();
		// TODO Auto-generated constructor stub
	}
	//클라이언트가 소켓에 최초 접속하면 자동으로 호출되는 메소드
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("클라이언트 접속 : "+ session);
	}
	//클라이언트가 소켓으로 데이터를 전송하면 자동으로 호출되는 메소드
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		//System.out.println("메세지를 보낸 클라이언트 : " +session );
		//System.out.println(message);
		//System.out.println(message.getPayload());
		//클라이어느가 보낸 메세지는 json=>문자열로 변환해서 전송
		//문자열 형태로 가지고 있으면 구분해서 사용하기가 힘드므로 Java의 객체형태로 변환할것
		ObjectMapper om = new ObjectMapper();
		ChatDTO chat = om.readValue(message.getPayload(), ChatDTO.class);
		System.out.println(chat.getMemberId() +" : "+chat.getMessage());
		System.out.println(chat.getType());
		System.out.println(session.getRemoteAddress());
		if(chat.getType().equals("enter")) {
			//채팅방에 입장 => hashmap에 저장
			members.put(session, chat.getMemberId());
//			System.out.println("접속한 회원 수 : " +members.size());
			ChatDTO sendMessage = new ChatDTO();
			sendMessage.setType("enter");
			sendMessage.setMemberId(chat.getMemberId());
			String data = om.writeValueAsString(sendMessage);
			TextMessage sendData = new TextMessage(data);
			for(WebSocketSession s:members.keySet()) {
				s.sendMessage(sendData);
			}
		}else if(chat.getType().equals("chat")) {
			//서버에서 클라이언트로 데이터를 전송
			ChatDTO sendMessage = new ChatDTO();
			sendMessage.setMemberId(chat.getMemberId());
			sendMessage.setMessage(chat.getMessage());
			sendMessage.setType("chat");
			String data = om.writeValueAsString(sendMessage); //객체를 문자열로 변환
			TextMessage sendData = new TextMessage(data);
			//이세선과 연결돤 클라이언트에게 전송
			//session.sendMessage(sendData);//@해당 세션 클라이언트에게 전송
			//접속한 모든 사람들에게 전송해야함==>members에 저장된 회원(전체 채팅에 저장된 회원 모두에게 메세지 전달)
			for(WebSocketSession s : members.keySet()) {
				s.sendMessage(sendData);
			}
			
			
		}
		
	}
	
	
	//클라이언트가 소켓에서 접속이 끊어지면 자동으로 호출되는 메소드
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("클라이언트 접속 끊김 : "+ session);
		
		//@접속이 끊어진 세션은 members에서 제거
		//접속이 끊어진 회원은 접속회원목록에서 삭제
		ObjectMapper om = new ObjectMapper();
		ChatDTO sendData = new ChatDTO();
		sendData.setType("out");
		sendData.setMemberId(members.get(session));
		members.remove(session);
		String data = om.writeValueAsString(sendData);
		TextMessage sendMessage = new TextMessage(data);
		for(WebSocketSession s: members.keySet()) {
			s.sendMessage(sendMessage);
		}
	}
	
}
