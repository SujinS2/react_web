package kr.co.iei.board.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.board.model.dto.BoardDTO;
import kr.co.iei.board.model.dto.BoardFileDTO;
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
		//조회결과는 게시물목록, pageNavi 생성시 필요한 데이터들
		Map map = boardService.selectBoardList(reqPage);
		return ResponseEntity.ok(map);
	}
	
	@PostMapping(value="/editorImage")
	public ResponseEntity<String> editorImage(@ModelAttribute MultipartFile image){//form에서 append한 이름 그대로
		String savepath = root+"/editor/";
		String filepath = fileUtil.upload(savepath, image);
		return ResponseEntity.ok("/editor/"+filepath);
	}
	
	@PostMapping
	public ResponseEntity<Boolean> insertBoard(@ModelAttribute BoardDTO board, @ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile[] boardFile){
		if(thumbnail != null) {
			String savepath = root+"/board/thumb/";
			String filepath = fileUtil.upload(savepath, thumbnail);
			board.setBoardThumb(filepath);
		}
		List<BoardFileDTO> boardFileList = new ArrayList<BoardFileDTO>();
		if(boardFile !=null) {
			String savepath = root+"/board/";
			for(MultipartFile file:boardFile) {
				BoardFileDTO fileDTO = new BoardFileDTO();
				String filename = file.getOriginalFilename();
				String filepath = fileUtil.upload(savepath, file);
				fileDTO.setFilename(filename);
				fileDTO.setFilepath(filepath);
				boardFileList.add(fileDTO);
			}
		}
		boolean result = boardService.insertBoard(board, boardFileList);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value="/boardNo/{boardNo}")
	public ResponseEntity<BoardDTO> selectOneBoard(@PathVariable int boardNo){
	BoardDTO board = boardService.selectOneBoard(boardNo);
	return ResponseEntity.ok(board);
	}
	
	@GetMapping(value="/file/{boardFileNo}")
	//파일(json이 아닌 그 자체)을 전송하기 위해서는 ResponseEntity를 <Resource>타입으로 리턴(org.springframework.core.io)
	public ResponseEntity<Resource> filedown(@PathVariable int boardFileNo) throws FileNotFoundException{
		BoardFileDTO boardFile = boardService.getBoardFile(boardFileNo);
		String savepath = root+"/board/";
		File file = new File(savepath+boardFile.getFilepath());
		
		Resource resource = new InputStreamResource(new FileInputStream(file));
		//파일 다운로드를 위한 헤더 설정(HttpHeaders >> org.springframework.http
		HttpHeaders header = new HttpHeaders();
		//header.add("Content-Diposition", "attachment; filename=\""+boardFile.getFilename()+"\""); //파일 이름을 알려주는 것
		//==>파일 명이 한글이면 에러남(추가적으로 인코딩 필요: 좀 복잡함 하지만 우리는 프론트에 파일명이 따로 있으므로 굳이 필요하지 않음)
		header.add("Cache-Control", "no-cache, no-store, must-revalidate"); //캐시 서버 사용하지 않겠다는 설정
		header.add("Pragma", "no-cache");//캐시 서버 안쓰겠다는 설정(옛날 서버 용)
		header.add("Expires", "0"); //파일 보내는거 끝나면 0을 보내겠음
		return ResponseEntity
				.status(HttpStatus.OK) //이 요청을 내가 정상적으로 처리했다는 뜻
				.headers(header)		//내가 만든 header를 헤더로 쓰겠다는 뜻
				.contentLength(file.length()) //용량(아마도 파일크기)을 알려주기 위함
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.body(resource);
	}
	
	@DeleteMapping(value="/{boardNo}")
	public ResponseEntity<Boolean> deleteBoard(@PathVariable int boardNo){
		List<BoardFileDTO> delFileList = boardService.deleteBoard(boardNo);
		if(delFileList !=null) {
			String savepath = root+"/board/";
			for(BoardFileDTO boardFile :delFileList) {
				File delFile = new File(savepath+boardFile.getFilepath());
				delFile.delete();
			}
			return ResponseEntity.ok(true);
		}else {
			return ResponseEntity.ok(false);
		}
	}
	
	@PatchMapping
	public ResponseEntity<Boolean> updateBoard(@ModelAttribute BoardDTO board, @ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile[] boardFile ){
		if(thumbnail !=null) {
			String savepath = root+"/board/thumb/";
			String filepath = fileUtil.upload(savepath, thumbnail);
			board.setBoardThumb(filepath);
		}
		List<BoardFileDTO> boardFileList = new ArrayList<BoardFileDTO>();
		if(boardFile !=null) {
			String savepath = root+"/board/";
			for(MultipartFile file : boardFile) {
				BoardFileDTO boardFileDTO = new BoardFileDTO();
				String filename = file.getOriginalFilename();
				String filepath = fileUtil.upload(savepath, file);
				boardFileDTO.setFilepath(filepath);
				boardFileDTO.setFilename(filename);
				boardFileDTO.setBoardNo(board.getBoardNo());
				boardFileList.add(boardFileDTO);
			}
		}
		List<BoardFileDTO> delFileList = boardService.updateBoard(board, boardFileList);
		if(delFileList !=null) {
			String savepath=root+"/board/";
			for(BoardFileDTO deleteFile:delFileList) {
				File delFile = new File(savepath+deleteFile.getFilepath());
				delFile.delete();
			}
			return ResponseEntity.ok(true);
		}else {
			return ResponseEntity.ok(false);
		}
	}
}
