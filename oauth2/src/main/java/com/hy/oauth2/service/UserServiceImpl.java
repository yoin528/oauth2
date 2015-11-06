package com.hy.oauth2.service;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.hy.oauth2.model.OauthUserDetails;
import com.hy.oauth2.model.User;

@Service("userService")
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

	public UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException {
		Query query = sessionFactory.getCurrentSession().createQuery(" from User u where u.username = ? ");
		query.setParameter(0, username);
		User user = (User)query.uniqueResult();
		if (user == null) {
            throw new UsernameNotFoundException("Not found any user for username[" + username + "]");
        }

        return new OauthUserDetails(user);
	}

}
