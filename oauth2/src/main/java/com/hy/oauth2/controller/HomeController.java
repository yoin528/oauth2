package com.hy.oauth2.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hy.oauth2.model.User;
import com.hy.oauth2.service.UserService;

@Controller
@RequestMapping("/")
public class HomeController extends BaseController{
	
	@Autowired
	private UserService userService;
	
	@RequestMapping("")
	public String home(){
		return "login";
	}
	@RequestMapping("/all")
	public String all(String clientId,String clientSecret,String code,String redirectUri){
		System.out.println(clientId+","+clientSecret+","+code+","+redirectUri);
		return "all";
	}
	
	@RequestMapping("/json")
	@ResponseBody
	public List<User> json(){
		return userService.getAllUsers();
	}
	
	@RequestMapping("/admin")
	@ResponseBody
	public List<String> admin(){
		return Arrays.asList("admin", "lisi", "user");
	}
	@RequestMapping("/denied")
	public String denied() {
		return "denied";
	}
	@RequestMapping("/user/user_info")
	public void userInfo() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    Object principal = authentication.getPrincipal();
	    System.out.println(authentication.getName());
	    if (authentication instanceof OAuth2Authentication &&
                (principal instanceof String || principal instanceof com.hy.oauth2.model.User)) {
	    	OAuth2Authentication oauth2Authentication = (OAuth2Authentication) authentication;
	    	System.out.println(oauth2Authentication.getName());
	    	writeJson(response, principal);
        } else {
        	writeJson(response, principal);
        }
	}
}
