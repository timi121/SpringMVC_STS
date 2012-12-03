<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<html>
<head>
<title>Insert title here</title>
<style>
.searchList01 {width:100%; overflow:hidden;}
.searchList01 li {float:left; float:left; width:250px; }
label { width: 80px; display: inline-block;}
</style>
</head>
<body>

	<form id="demoForm" method="post">
		<table id="testTable">
		</table>

		<table id="testTable">
		</table>
		<table id="list2"></table>
		<div id="pager2" ></div>
		
		<div style="display:none">
		</div>
		<ul class="searchList01">
			<li><label>user_id : </label><input id="user_id" name="user_id" type="text"></li>
			<li><label>inv_date : </label><input id="inv_date" name="inv_date" type="text"></li>
			<li><label>name : </label><input id="name" name="name" type="text"></li>
			<li><label>amount : </label><input id="amount" name="amount" type="text"></li>
			<li><label>tax : </label><input id="tax" name="tax" type="text"></li>
			<li><label>total : </label><input id="total" name="total" type="text"></li>
			<li><label>note : </label><input id="note" name="note" type="text"></li>
		</ul>
		<button id="btn_search" type="button">검색 </button>
		<button id="btn_in_post" type="submit">저장</button>
	</form>
	
 	<script type="text/javascript" src="resources/js/demo/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="resources/js/jqGridCommInclude.js"></script>
	<script type="text/javascript" src="resources/js/demo/json2.js"></script>
	<script type="text/javascript" src="resources/js/demo/jquery.json.util.js"></script>	
	
	
	<script type="text/javascript" src="resources/js/demo/demo.js"></script>


	<script type="text/javascript">

	</script>
</body>
</html>