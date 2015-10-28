package com.ldz.oauth2.service;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ldz.oauth2.model.User;

@Service
@Transactional
public class UserServiceImpl implements UserService {
	@Autowired
	private SessionFactory sessionFactory;

	public void saveUsers(List<User> us) {
		for (User u : us) {
			sessionFactory.getCurrentSession().save(u);
		}
	}

	public List<User> getAllUsers() {
		Criteria criteria = sessionFactory.getCurrentSession().createCriteria(User.class);
		return criteria.list();
	}

}
