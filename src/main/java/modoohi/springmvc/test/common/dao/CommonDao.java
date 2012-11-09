package modoohi.springmvc.test.common.dao;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Repository;

@Repository
public class CommonDao extends SqlSessionDaoSupport {

	@Resource(name="sqlSession")
	protected void initDao(SqlSessionTemplate sqlSessionTemplate) {
		this.setSqlSessionTemplate(sqlSessionTemplate);
	}
	
	/**
	 * 조회
	 * @param sqlId SQL ID
	 * @param obj	조건 값
	 * @return
	 */
	public List<HashMap<String, Object>> select(String sqlId, Object obj) {
		List<HashMap<String, Object>> list = getSqlSession().selectList(sqlId, obj);		
		return list;		
	}
	
	
	/**
	 * 등록
	 * @param sqlId
	 * @param obj
	 * @return
	 */
	public int insert(String sqlId, Object obj) {
		int result = 0;
		result = getSqlSession().insert(sqlId, obj); 
		return result;
	}
	
	/**
	 * 수정
	 * @param sqlId
	 * @param obj
	 * @return
	 */
	public int update(String sqlId, Object obj) {
		int result = 0;
		result = getSqlSession().update(sqlId, obj);		
		return result;
	}
}
