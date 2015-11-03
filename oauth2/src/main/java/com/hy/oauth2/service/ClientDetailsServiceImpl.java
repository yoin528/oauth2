package com.hy.oauth2.service;

import javax.transaction.Transactional;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hy.oauth2.model.ClientDetails;
@Transactional
@Service("clientDetailsServiceImpl")
public class ClientDetailsServiceImpl implements ClientDetailsService {
	@Autowired
	private SessionFactory sessionFactory;
	public ClientDetails loadByClientId(String clientId) {
		String hql = "from ClientDetails where clientId = ?";
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		query.setParameter(0, clientId);
		return (ClientDetails)query.uniqueResult();
	}
}