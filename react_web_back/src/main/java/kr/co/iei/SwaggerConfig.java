package kr.co.iei;

import java.util.HashSet;
import java.util.Set;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
@EnableWebMvc
public class SwaggerConfig {
	private ApiInfo swaggerInfo() {
		//자동으로 문서 작성할때 제목부분
		return new ApiInfoBuilder().title("MEMBER API").description("회원정보 CRUD 문서").build(); 
	}
	//요청 형식 지정(테스트할때 요청할때 받을 형식)
	private Set<String> getConsumeContentType(){
		Set<String> consumes = new HashSet<String>();
		consumes.add("application/json;charset=UTF-8");//json 형식으로 요청 들어가거나
		consumes.add("application/x-www-form-urlencoded");//폼태그 형식으로 요청 들어갈거임
		return consumes;
	}
	
	//응답형식(응답할때 줄 형식)
	private Set<String> getProduceContentType(){
		Set<String> produces = new HashSet<String>();
		produces.add("application/json;charset=UTF-8");//json 형식으로 보내주거나
		produces.add("plain/text;charset=UTF-8");//문자형식으로 보낼 수 있음
		return produces;
	}
	
	//문서만들어달라고 객체 만들것
	@Bean
	public Docket swaggerApi() {
		return new Docket(DocumentationType.SWAGGER_2) //문서 스타일 (SWAGGER_2)
					.consumes(getConsumeContentType()) //요청 관련 설정
					.produces(getProduceContentType()) //응답 관련 설정
					.apiInfo(swaggerInfo()).select()			//제목
					.apis(RequestHandlerSelectors.basePackage("kr.co.iei")) //모두 들어라가고 kr.co.iei 넣은것 원래는 controller package 정보 넣어야함(모르겠으면.. 그냥 kr.co.iei써..)
					.paths(PathSelectors.any())
					.build()
					.useDefaultResponseMessages(false);
	}
}
