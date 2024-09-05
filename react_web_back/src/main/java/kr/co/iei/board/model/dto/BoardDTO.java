package kr.co.iei.board.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="board")
public class BoardDTO {
	private int boardNo;
	private String boardTitle;
	private String boardContent;
	private int boardStatus;
	private boolean boardStatusB;
	private String boardThumb;
	private String boardWriter;
	private String boardDate;
	private List<BoardFileDTO> fileList;
	private int[] delBoardFileNo;
}
