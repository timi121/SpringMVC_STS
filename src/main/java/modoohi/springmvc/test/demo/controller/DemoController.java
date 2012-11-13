package modoohi.springmvc.test.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import modoohi.springmvc.test.common.dao.CommonDao;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class DemoController {

	@Resource(name="commonDao")
	private CommonDao commonDao;


	/**
	 * 
	 * 요청 URL : demo/select?id=1 
	 * 
	 * @PathVariable String name = select
	 * @RequestParam("user_id") String test = 1
	 *  
	 * @param name
	 * @param test
	 * @return
	 */	
	@RequestMapping(value="/demo/{gName}", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> searchJsonDataByGet(@PathVariable String gName
			, @RequestParam("_search") boolean isSearch
			, @RequestParam("nd") String nd
			, @RequestParam("rows") int rows
			, @RequestParam("page") int page
			, @RequestParam("sidx") String sidx
			, @RequestParam("sord") String sord
			) {	
		Map<String, Object> resultMap = new HashMap<String, Object>();

		List<?> resultList = null;
		int totalResultCnt = 0; // 검색 결과 갯수
		int totalPageNum = 0;	// 전체 페이지 수
		int currentPageIdx = page; // 현재 선택 인덱스
		int offset = 0; // 지정된 갯수 다음 부터 출력
		int limit = rows;	// 화면에 보여줄 갯수
		


		HashMap<String, Object> paramMap = new HashMap<String, Object>();
//		paramMap.put("user_id", user_id);
//		paramMap.put("inv_date", inv_date);
//		paramMap.put("name", name);
//		paramMap.put("amount", amount);
//		paramMap.put("tax", tax);
//		paramMap.put("total", total);
		//paramMap.put("note", note);

		try {
			
			totalResultCnt = commonDao.getCount("modoohi.springmvc.test.sqlMap.Sample.getAccountCount", paramMap);			
			
			if (totalResultCnt > 0) {
				totalPageNum = (totalResultCnt/limit) + 1;
			}else {
				totalPageNum = 0;
			}
			
			offset = limit * currentPageIdx;
			paramMap.put("limit", limit);
			paramMap.put("offset", offset);
			
			resultList = commonDao.select("modoohi.springmvc.test.sqlMap.Sample.getAccountList", paramMap);
			
			resultMap.put("result", "SUCCESS");
			resultMap.put("list", resultList);
			resultMap.put("page", currentPageIdx);
			resultMap.put("total", totalPageNum);
			resultMap.put("records", totalResultCnt);
			
			
			
		} catch (Exception e) {
			resultMap.put("result", "FAIL");
			resultMap.put("fail_message", e.getMessage());
			resultMap.put("list", resultList);			
		}

		return resultMap;
	}
	/**
	 * 
	 * 요청 URL : demo/select?id=1 
	 * 
	 * @PathVariable String name = select
	 * @RequestParam("user_id") String test = 1
	 *  
	 * @param name
	 * @param test
	 * @return
	 */	
	@RequestMapping(value="/demo/{gName}2", method = RequestMethod.GET)
	@ResponseBody	
	public Map<String, Object> searchJsonDataByGet2(@PathVariable String gName
													, @RequestParam("user_id") String user_id
													, @RequestParam("inv_date") String inv_date
													, @RequestParam("name") String name
													, @RequestParam("amount") String amount
													, @RequestParam("tax") String tax
													, @RequestParam("total") String total
													, @RequestParam("note") String note) {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		List<?> resultList = null;
		int totalResultCnt = 0; // 검색 결과 갯수
		int totalPageNum = 0;	// 전체 페이지 수
		int currentPageIdx = 0; // 현재 선택 인덱스
		int offset = 0; // 지정된 갯수 다음 부터 출력
		int limit = 10;	// 화면에 보여줄 갯수
		


		HashMap<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("user_id", user_id);
		paramMap.put("inv_date", inv_date);
		paramMap.put("name", name);
		paramMap.put("amount", amount);
		paramMap.put("tax", tax);
		paramMap.put("total", total);
		//paramMap.put("note", note);

		try {
			
			totalResultCnt = commonDao.getCount("modoohi.springmvc.test.sqlMap.Sample.getAccountCount", paramMap);			
			
			if (totalResultCnt > 0) {
				totalPageNum = (totalResultCnt/limit) + 1;
			}else {
				totalPageNum = 0;
			}
			
			offset = limit * currentPageIdx;
			paramMap.put("limit", limit);
			paramMap.put("offset", offset);
			
			resultList = commonDao.select("modoohi.springmvc.test.sqlMap.Sample.getAccountList", paramMap);
			
			resultMap.put("result", "SUCCESS");
			resultMap.put("list", resultList);
			resultMap.put("page", currentPageIdx);
			resultMap.put("total", totalPageNum);
			resultMap.put("records", totalResultCnt);
			
			
			
		} catch (Exception e) {
			resultMap.put("result", "FAIL");
			resultMap.put("fail_message", e.getMessage());
			resultMap.put("list", resultList);			
		}

		return resultMap;
	}
	
	/**
	 * 등록
	 * @param obj
	 * @return
	 */
	@RequestMapping(value="demo/insert", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> insertJsonDataByPost(@RequestBody String  obj) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		int resultInt = 0;

		try {
			ObjectMapper mapper = new ObjectMapper();
			Map<?,?> paramMap = mapper.readValue(obj, Map.class);
			
			resultInt = commonDao.insert("modoohi.springmvc.test.sqlMap.Sample.insertAccount", paramMap);
			resultMap.put("result", "SUCCESS");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "FAIL");
			resultMap.put("fail_message", e.getMessage());
		}
		System.out.println(resultInt);

		return resultMap;
	}

	/**
	 * 업데이트
	 * @param obj
	 * @return
	 */
	@RequestMapping(value="demo/update", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> updateJsonDataByPost(@RequestBody String  obj) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		int resultInt = 0;

		try {
			ObjectMapper mapper = new ObjectMapper();
			Map<?,?> paramMap = mapper.readValue(obj, Map.class);
			
			resultInt = commonDao.update("modoohi.springmvc.test.sqlMap.Sample.updateAccount", paramMap);
			resultMap.put("result", "SUCCESS");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "FAIL");
			resultMap.put("fail_message", e.getMessage());
		}
		System.out.println(resultInt);

		return resultMap;
	}
}