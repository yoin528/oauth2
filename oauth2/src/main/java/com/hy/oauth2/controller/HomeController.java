package com.hy.oauth2.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
	public String all(){
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
}
