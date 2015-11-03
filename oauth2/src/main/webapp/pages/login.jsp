<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%
String path = request.getContextPath(); 
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
request.setAttribute("base", basePath);
request.setAttribute("msg", request.getParameter("login"));
%>
<sec:authentication property="principal" var="auth" scope="session" />

<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>汇业生态城</title>
<link type="text/css" href="${base}/static/oauth_web.css?version=20140625" rel="stylesheet" />

<!--<style>
	body { padding-bottom:300px; }
</style>-->
</head>
<body class="WB_UIbody WB_widgets">
<div class="WB_xline1 oauth_xline" id="outer">
 <div class="oauth_wrap">
    <div class="oauth_header clearfix">
      <h1 class="WB_logo" title="汇业"><a href="http://www.member.com/server">汇业</a></h1>
		<p class="login_account"><a class="sign_up_link" href="www.member.com/server/register" target="_blank">注册</a>
		</p>
    </div>
    <!-- 带头像  -->
    <div class="WB_panel oauth_main">
    <form name="authZForm" action="${base}login" method="post" node-type="form">
      <div class="oauth_content" node-type="commonlogin">
        <p class="oauth_main_info" style="margin-bottom: 15px;">使用你的汇业帐号访问  <a href="http://www.member.com/server"  target="_blank" class="app_name">HuiYe.COM</a> 
        ，并同时登录汇业</p>
        	
        <!-- 登录 -->
        	<div class="oauth_login clearfix" style="margin-top: 10px;">
	       	       		<c:if test="${msg == 'error'}">
		       	       		<p style="line-height: 30px;text-align: center;width: 540px;color: red;font-weight: bold;">
		       	       			错误：用户名或密码有误！
		       	       		</p>
	       	       		</c:if>
					<div class="oauth_login_form">
			            <p class="oauth_login_01" >
			              <label class="oauth_input_label">帐号：</label>
			              <input type="text" class="WB_iptxt oauth_form_input" id="username" onblur="alertMsg(this);" onfocus="focusMsg(this);" name="username"  value="请用汇业帐号登录" node-type="userid" autocomplete="off" tabindex="1" />
			            </p>
			            <p>
			              <label class="oauth_input_label">密码：</label>
			              <input type="password" class="WB_iptxt oauth_form_input" id="password" name="password" node-type="passwd" autocomplete="off" tabindex="2"/>
			            </p>
						</div>
				<!-- </form> -->
				<div class="tips WB_tips_yls WB_oauth_tips" node-type="tipBox" style="display:none">
					<span class="WB_tipS_err"></span><span class="WB_sp_txt" node-type="tipContent" ></span>
					<span class="arr" node-type="tipArrow"></span>
					<a href="javascript:;" class="close" node-type="tipClose"></a>
				</div>
        </div>
        <div class="oauth_login_box01 clearfix">
          <div class="oauth_login_submit">
              <p class="oauth_formbtn"><a node-type="submit" tabindex="4" action-type="submit" onclick="subBtn();"  href="javascript:;" class="WB_btn_login formbtn_01"></a><a node-type="cancel" tabindex="5" href="javascript:;" action-type="cancel" class="WB_btn_cancel"></a></p>
          </div>
          <!-- todo 添加appkey 白名单判断 -->
         </div>
        <!-- /登录 --> 
        </div>
      </form>
    </div>
    <!-- /带头像 -->
    <!-- 根据域名修改文案 -->
      <p class="oauth_tiptxt">提示：为保障帐号安全，请认准本页URL地址必须以 www.member.com 开头</p>
    </div>
  </div>
  
<script src="${base}/static/ssologin.js?version=20151026" charset="utf-8"></script>
<script type="text/javascript">
	function alertMsg(obj) {
		if(obj.value=="") {
			obj.value = "请用汇业帐号登录";
		}
	}
	function focusMsg(obj) {
		if(obj.value=="请用汇业帐号登录") {
			obj.value="";
		}
	}
	function subBtn() {
		document.forms[0].submit();
	}
	(function() {
	if(self !== top) {
	var img = new Image();
	var src = 'https://api.weibo.com/oauth2/images/bg_layerr.png?oauth=1&page=web&refer=' + document.referrer + '&rnd=' + (+new Date());
	img.src = src
	img = null; //释放局部变量
	}
	})();
</script>
</body>
</html>