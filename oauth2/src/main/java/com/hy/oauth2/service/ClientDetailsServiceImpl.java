package com.hy.oauth2.service;

import javax.transaction.Transactional;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hy.oauth2.model.ClientDetails;
@Transactional
@Service("clientDetailsService")
public class ClientDetailsServiceImpl implements ClientDetailsService {
	@Autowired
	private SessionFactory sessionFactory;
	public ClientDetails loadByClientId(String clientId) {
		String sql = "select * from oauth_client_details where clientId = ?";
		Query query = sessionFactory.getCurrentSession().createQuery(sql);
		query.setParameter(0, clientId);
		return (ClientDetails)query.uniqueResult();
	}
}