<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>

<c:set var="base" value="${pageContext.request.contextPath }/" scope="session"/>
<sec:authentication property="principal" var="auth" scope="session" />

<html>
<body>
<h2>您没有访问权限!</h2>
<a href="javascript:history.go(-1);">返回</a>
</body>
</html>
