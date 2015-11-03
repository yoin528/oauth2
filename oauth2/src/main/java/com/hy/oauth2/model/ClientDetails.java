package com.hy.oauth2.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
@Entity
@Table(name="oauth_client_details")
public class ClientDetails {
	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="id")
	private Integer id;
	@Column(name="access_token_validity")
	private Integer accessTokenValidity;
	@Column(name="additional_information")
	private String additionalInformation;
	@Column(name="archived")
	private Boolean archived;
	@Column(name="authorities")
	private String authorities;
	@Column(name="authorized_grant_types")
	private String authorizedGrantTypes;
	@Column(name="client_id")
	private String clientId;
	@Column(name="client_secret")
	private String clientSecret;
	@Column(name="create_time")
	private Date createTime = new Date();
	@Column(name="refresh_token_validity")
	private Integer refreshTokenValidity;
	@Column(name="resource_ids")
	private String resourceIds;
	@Column(name="scope")
	private String scope;
	@Column(name="trusted")
	private Boolean trusted;
	@Column(name="web_server_redirect_uri")
	private String webServerRedirectUri;
	@Column(name="autoapprove")
	private Boolean autoapprove;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getAccessTokenValidity() {
		return accessTokenValidity;
	}
	public void setAccessTokenValidity(Integer accessTokenValidity) {
		this.accessTokenValidity = accessTokenValidity;
	}
	public String getAdditionalInformation() {
		return additionalInformation;
	}
	public void setAdditionalInformation(String additionalInformation) {
		this.additionalInformation = additionalInformation;
	}
	public Boolean getArchived() {
		return archived;
	}
	public void setArchived(Boolean archived) {
		this.archived = archived;
	}
	public String getAuthorities() {
		return authorities;
	}
	public void setAuthorities(String authorities) {
		this.authorities = authorities;
	}
	public String getAuthorizedGrantTypes() {
		return authorizedGrantTypes;
	}
	public void setAuthorizedGrantTypes(String authorizedGrantTypes) {
		this.authorizedGrantTypes = authorizedGrantTypes;
	}
	public String getClientId() {
		return clientId;
	}
	public void setClientId(String clientId) {
		this.clientId = clientId;
	}
	public String getClientSecret() {
		return clientSecret;
	}
	public void setClientSecret(String clientSecret) {
		this.clientSecret = clientSecret;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Integer getRefreshTokenValidity() {
		return refreshTokenValidity;
	}
	public void setRefreshTokenValidity(Integer refreshTokenValidity) {
		this.refreshTokenValidity = refreshTokenValidity;
	}
	public String getResourceIds() {
		return resourceIds;
	}
	public void setResourceIds(String resourceIds) {
		this.resourceIds = resourceIds;
	}
	public String getScope() {
		return scope;
	}
	public void setScope(String scope) {
		this.scope = scope;
	}
	public Boolean getTrusted() {
		return trusted;
	}
	public void setTrusted(Boolean trusted) {
		this.trusted = trusted;
	}
	public String getWebServerRedirectUri() {
		return webServerRedirectUri;
	}
	public void setWebServerRedirectUri(String webServerRedirectUri) {
		this.webServerRedirectUri = webServerRedirectUri;
	}
	public Boolean getAutoapprove() {
		return autoapprove;
	}
	public void setAutoapprove(Boolean autoapprove) {
		this.autoapprove = autoapprove;
	}
	
}
