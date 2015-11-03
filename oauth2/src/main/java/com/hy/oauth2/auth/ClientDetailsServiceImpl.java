package com.hy.oauth2.auth;

import javax.sql.DataSource;

import org.springframework.security.oauth2.provider.client.JdbcClientDetailsService;

/**
 * 覆盖查询数据库中要询客户端系统的查询方法，方便以后其它客户端接入
 * @author LDZ   
 * @date 2015年10月29日 上午11:32:58 
 */
public class ClientDetailsServiceImpl extends JdbcClientDetailsService {
	private String selectClientDetailsSql = "select client_id,client_secret,"
			+ "resource_ids, scope,authorized_grant_types, "
			+ "web_server_redirect_uri, "
			+ "authorities, access_token_validity,refresh_token_validity, "
			+ "additional_information,autoapprove "//spring security3.2多了一个字段
			+ "from oauth_client_details where client_id = ? and archived = 0 ";
	public ClientDetailsServiceImpl(DataSource dataSource) {
		super(dataSource);
		setSelectClientDetailsSql(selectClientDetailsSql);
	}


}