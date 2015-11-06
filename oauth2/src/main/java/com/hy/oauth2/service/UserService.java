package com.hy.oauth2.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.hy.oauth2.model.User;

public interface UserService extends UserDetailsService{
	public void saveUsers(List<User> us);
	public List<User> getAllUsers();
}
