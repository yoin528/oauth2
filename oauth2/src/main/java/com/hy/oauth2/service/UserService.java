package com.hy.oauth2.service;

import java.util.List;

import com.hy.oauth2.model.User;

public interface UserService {
	public void saveUsers(List<User> us);
	public List<User> getAllUsers();
}
