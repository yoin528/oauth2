package com.hy.oauth2.auth;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.provider.AuthorizationRequest;
import org.springframework.security.oauth2.provider.approval.TokenStoreUserApprovalHandler;

import com.hy.oauth2.model.ClientDetails;
import com.hy.oauth2.service.ClientDetailsService;

public class ClientApprovalHandlerImpl extends TokenStoreUserApprovalHandler {
	private ClientDetailsService clientDetailsService;
	@Override
	public boolean isApproved(AuthorizationRequest authorizationRequest,
			Authentication userAuthentication) {
		if(super.isApproved(authorizationRequest, userAuthentication)) {
			return true;
		}
		if (!userAuthentication.isAuthenticated()) {
            return false;
        }
		ClientDetails clientDetails = clientDetailsService.loadByClientId(authorizationRequest.getClientId());
		return clientDetails != null && clientDetails.getTrusted();
	}
	public void setClientDetailsService(ClientDetailsService clientDetailsService) {
		this.clientDetailsService = clientDetailsService;
	}
	
}
