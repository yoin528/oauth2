package com.hy.oauth2.service;

import com.hy.oauth2.model.ClientDetails;

public interface ClientDetailsService {
	public ClientDetails loadByClientId(String clientId);
}
