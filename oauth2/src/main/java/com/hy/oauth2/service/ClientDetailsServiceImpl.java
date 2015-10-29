package com.hy.oauth2.service;

import javax.sql.DataSource;

import org.springframework.security.oauth2.provider.client.JdbcClientDetailsService;

/**
 * @author LDZ   
 * @date 2015年10月29日 上午11:32:58 
 */
public class ClientDetailsServiceImpl extends JdbcClientDetailsService {
	private String selectClientDetailsSql = "select client_id,client_secret,"
			+ "resource_ids, scope,authorized_grant_types, "
			+ "web_server_redirect_uri, "
			+ "authorities, access_token_validity,refresh_token_validity, "
			+ "additional_information, autoapprove "
			+ "from oauth_client_details where client_id = ? and archived = 0 ";
	public ClientDetailsServiceImpl(DataSource dataSource) {
		super(dataSource);
		setSelectClientDetailsSql(selectClientDetailsSql);
	}


}
