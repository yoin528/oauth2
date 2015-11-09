package com.hy.oauth2.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * @author Shengzhao Li
 */
public class OauthUserDetails implements UserDetails {

    protected static final String ROLE_PREFIX = "ROLE_";
//    protected static final GrantedAuthority DEFAULT_USER_ROLE = new SimpleGrantedAuthority(ROLE_PREFIX + Privilege.USER.name());

    protected User user;

    protected List<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>();

    public OauthUserDetails() {
    }
    public OauthUserDetails(User user) {
        this.user = user;
        initialAuthorities();
    }

    private void initialAuthorities() {
        //Default, everyone have it
//        this.grantedAuthorities.add(DEFAULT_USER_ROLE);
        //default user have all privileges
//        if (user.defaultUser()) {
//            this.grantedAuthorities.add(new SimpleGrantedAuthority(ROLE_PREFIX + Privilege.UNITY.name()));
//            this.grantedAuthorities.add(new SimpleGrantedAuthority(ROLE_PREFIX + Privilege.MOBILE.name()));
//        } else {
//            final List<Privilege> privileges = user.privileges();
//            for (Privilege privilege : privileges) {
//                this.grantedAuthorities.add(new SimpleGrantedAuthority(ROLE_PREFIX + privilege.name()));
//            }
//        }
    }

    /**
     * Return authorities, more information see {@link #initialAuthorities()}
     *
     * @return Collection of GrantedAuthority
     */
    public Collection<GrantedAuthority> getAuthorities() {
        return this.grantedAuthorities;
    }

    public String getPassword() {
        return user.getPassword();
    }

    public String getUsername() {
        return user.getUsername();
    }

    public boolean isAccountNonExpired() {
        return true;
    }

    public boolean isAccountNonLocked() {
        return true;
    }

    public boolean isCredentialsNonExpired() {
        return true;
    }

    public boolean isEnabled() {
        return true;
    }

    public User user() {
        return user;
    }


    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("{user=").append(user);
        sb.append('}');
        return sb.toString();
    }
}