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
	public void initDao(SqlSessionTemplate sqlSessionTemplate) {
		super.setSqlSessionTemplate(sqlSessionTemplate);
	}
	
	/**
	 * 갯수 반환
	 * @param sqlId
	 * @param obj
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public int getCount(String sqlId, Object obj) throws Exception{
		return getSqlSession().selectOne(sqlId, obj);  
	}

	/**
	 * 조회
	 * @param sqlId SQL ID
	 * @param obj	조건 값
	 * @return
	 */
	public List<HashMap<String, Object>> select(String sqlId, Object obj) throws Exception{
		return getSqlSession().selectList(sqlId, obj);		
	}
	
	
	/**
	 * 등록
	 * @param sqlId
	 * @param obj
	 * @return
	 */
	public int insert(String sqlId, Object obj) throws Exception{
		return getSqlSession().insert(sqlId, obj);
	}
	
	/**
	 * 수정
	 * @param sqlId
	 * @param obj
	 * @return
	 */
	public int update(String sqlId, Object obj) throws Exception{
		return getSqlSession().update(sqlId, obj);
	}
}
