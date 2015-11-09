package com.hy.oauth2.service;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(" from User u where u.username = ? ");
		query.setParameter(0, username);
		User user = (User)query.uniqueResult();
		if (user == null) {
            throw new UsernameNotFoundException("Not found any user for username[" + username + "]");
        }
		OauthUserDetails userDetails = new OauthUserDetails(user);
		SQLQuery sqlQuery = session.createSQLQuery("select r.role from user u left join role r on u.role_id=r.id where username = ?");
		sqlQuery.setParameter(0, username);
		List<String> roles = sqlQuery.list();
		for(String role : roles) {
			userDetails.addAuthorities(new SimpleGrantedAuthority(role));
		}
        return userDetails;
	}

}
