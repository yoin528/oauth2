package com.hy.oauth2.controller;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hy.oauth2.service.UserService;

/**
 * @author Shengzhao Li
 */
@Controller
@RequestMapping("/unity/")
public class UnityController  extends BaseController{


    @Autowired
    private UserService userService;


    @RequestMapping("dashboard")
    public String dashboard() {
        return "unity/dashboard";
    }

    @RequestMapping("user_info")
    public void userInfo(HttpServletResponse response) throws Exception {
//        final UserJsonDto jsonDto = userService.loadCurrentUserJsonDto();
//        writeJson(response, JSONObject.fromObject(jsonDto));
    }

}