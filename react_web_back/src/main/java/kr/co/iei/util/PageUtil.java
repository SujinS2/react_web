package kr.co.iei.util;

import org.springframework.stereotype.Component;

@Component
public class PageUtil {
	public PageInfo getPageInfo(int reqPage, int numPerPage, int pageNaviSize, int totalCount) {
		int end = numPerPage*(reqPage);
		int start = end -numPerPage +1;
		int totalPage = (int)Math.ceil((double)totalCount/numPerPage);
		int pageNo = reqPage-2;
		if(pageNo<=0 || pageNaviSize>=totalPage) {
			pageNo = 1;
		}else if(pageNo+pageNaviSize-1>totalPage) {
			pageNo = totalPage-4;
		}
		PageInfo pageInfo = new PageInfo(start, end, pageNo, pageNaviSize, totalPage);
		return pageInfo;
	}
}
