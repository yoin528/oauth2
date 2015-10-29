package com.hy.oauth2.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.ModelAttribute;

public class BaseController {
	protected HttpServletRequest request;
	protected HttpServletResponse response;
	/**
	 * 调用controlle前先调用此方法
	 * @param page 当前页
	 * @param limit 每页显示几条
	 */
	@ModelAttribute
	protected void before(HttpServletRequest request,HttpServletResponse response) {
		this.request = request;
		this.response = response;
		request.setAttribute("base","http://"  +  request.getServerName()  +  ":"  +  request.getServerPort()  +  request.getContextPath());
	}
}
