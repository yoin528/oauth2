package com.ldz.oauth2.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
/**
 * 客户端系统
 * @author LDZ   
 * @date 2015年10月28日 下午5:21:46
 */
@Entity
@Table(name="oauth_client_details")
public class ClientSystem implements Serializable {
	private static final long serialVersionUID = 1L;
	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(name = "id", nullable = false)
	private int id;
	@Column(name="client_id")
	private String clientId;
	@Column(name="resource_ids")
	private String resourceIds;
	@Column(name="client_secret")
	private String clientSecret;
	@Column(name="scope")
	private String scope;
	@Column(name="authorized_grant_types")
	private String authorizedGrantTypes;
	@Column(name="webServer_redirect_uri")
	private String webServerRedirectUri;
	@Column(name="authorities")
	private String authorities;
	@Column(name="access_token_validity")
	private int accessTokenValidity;
	@Column(name="refresh_token_validity")
	private int refreshTokenValidity;
	@Column(name="additional_information")
	private String additionalInformation;
	@Column(name="create_time")
	private Date createTime;
	@Column(name="archived")
	private Boolean archived;
	@Column(name="trusted")
	private Boolean trusted;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getClientId() {
		return clientId;
	}
	public void setClientId(String clientId) {
		this.clientId = clientId;
	}
	public String getResourceIds() {
		return resourceIds;
	}
	public void setResourceIds(String resourceIds) {
		this.resourceIds = resourceIds;
	}
	public String getClientSecret() {
		return clientSecret;
	}
	public void setClientSecret(String clientSecret) {
		this.clientSecret = clientSecret;
	}
	public String getScope() {
		return scope;
	}
	public void setScope(String scope) {
		this.scope = scope;
	}
	public String getAuthorizedGrantTypes() {
		return authorizedGrantTypes;
	}
	public void setAuthorizedGrantTypes(String authorizedGrantTypes) {
		this.authorizedGrantTypes = authorizedGrantTypes;
	}
	public String getWebServerRedirectUri() {
		return webServerRedirectUri;
	}
	public void setWebServerRedirectUri(String webServerRedirectUri) {
		this.webServerRedirectUri = webServerRedirectUri;
	}
	public String getAuthorities() {
		return authorities;
	}
	public void setAuthorities(String authorities) {
		this.authorities = authorities;
	}
	public int getAccessTokenValidity() {
		return accessTokenValidity;
	}
	public void setAccessTokenValidity(int accessTokenValidity) {
		this.accessTokenValidity = accessTokenValidity;
	}
	public int getRefreshTokenValidity() {
		return refreshTokenValidity;
	}
	public void setRefreshTokenValidity(int refreshTokenValidity) {
		this.refreshTokenValidity = refreshTokenValidity;
	}
	public String getAdditionalInformation() {
		return additionalInformation;
	}
	public void setAdditionalInformation(String additionalInformation) {
		this.additionalInformation = additionalInformation;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Boolean getArchived() {
		return archived;
	}
	public void setArchived(Boolean archived) {
		this.archived = archived;
	}
	public Boolean getTrusted() {
		return trusted;
	}
	public void setTrusted(Boolean trusted) {
		this.trusted = trusted;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
}
