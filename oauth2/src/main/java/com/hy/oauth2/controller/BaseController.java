package com.hy.oauth2.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSON;
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
	
	public static void writeJson(HttpServletResponse response, JSON json) {
        response.setContentType("application/json;charset=UTF-8");
        try {
            PrintWriter writer = response.getWriter();
            json.write(writer);
            writer.flush();
        } catch (IOException e) {
            throw new IllegalStateException("Write json to response error", e);
        }
    }
}
