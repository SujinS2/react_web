package kr.co.iei.board.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.board.model.service.BoardService;
import kr.co.iei.util.FileUtils;

@RestController
@CrossOrigin("*")
@RequestMapping(value="/board")
public class BoardController {
	@Autowired
	private BoardService boardService;
	@Autowired
	private FileUtils fileUtil;
	
	@Value("${file.root}")
	public String root;
	
	
	@GetMapping(value="/list/{reqPage}")
	public ResponseEntity<Map> list(@PathVariable int reqPage){
		//조회결과는 게시물목록, pageNavi 생성시 필요한 데이터들기름
		Map map = boardService.selectBoardList(reqPage);
		return ResponseEntity.ok(map);
	}
	
	@PostMapping(value="/editorImage")
	public ResponseEntity<String> editorImage(@ModelAttribute MultipartFile image){//form에서 append한 이름 그대로
		String savepath = root+"/editor/";
		String filepath = fileUtil.upload(savepath, image);
		return ResponseEntity.ok("/editor/"+filepath);
	}
}
