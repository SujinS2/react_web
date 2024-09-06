package kr.co.iei;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import kr.co.iei.chat.model.service.AllMemberChatHandler;

@Configuration
@EnableWebSocket
public class WebConfig implements WebMvcConfigurer, WebSocketConfigurer{
	//extends는 class/ implements는 interface 상속>>interface 상속은 여러개 가능
	@Value("${file.root}")
	private String root;
	
	@Autowired
	private AllMemberChatHandler allMemberChat;
	
	@Bean
	public BCryptPasswordEncoder bcrypt() {
		return new BCryptPasswordEncoder();
	}

	@Override //여기에서 소켓 url 연결
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(allMemberChat, "/allChat")
					.setAllowedOrigins("*"); //다른 url에서 들어와도 허용(controller의 crossOrigin과 비슷)
		
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/editor/**")
		.addResourceLocations("file:///"+root+"/editor/");
		
		registry.addResourceHandler("/board/thumb/**")
				.addResourceLocations("file:///"+root+"/board/thumb/");
	}
	
}
