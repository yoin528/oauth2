package com.ldz.oauth2.service;

import java.util.List;

import com.ldz.oauth2.model.User;

public interface UserService {
	public void saveUsers(List<User> us);
	public List<User> getAllUsers();
}
