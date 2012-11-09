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
													, @RequestParam("user_id") String user_id
													, @RequestParam("inv_date") String inv_date
													, @RequestParam("name") String name
													, @RequestParam("amount") String amount
													, @RequestParam("tax") String tax
													, @RequestParam("total") String total
													, @RequestParam("note") String note) {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		List<?> resultList = null;

		HashMap<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("user_id", user_id);
		paramMap.put("inv_date", inv_date);
		paramMap.put("name", name);
		paramMap.put("amount", amount);
		paramMap.put("tax", tax);
		paramMap.put("total", total);
		paramMap.put("note", note);

		try {
			resultList = commonDao.select("modoohi.springmvc.test.sqlMap.Sample.getAccountList", paramMap);
			
			resultMap.put("result", "SUCCESS");
			resultMap.put("list", resultList);			
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