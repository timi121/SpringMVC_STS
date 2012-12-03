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
		
		<div class="grid"></div> <br/>
		<button id="btn_search2" type="button">JQKGrid검색 </button>
		</body>		
	</form>
	
 	<script type="text/javascript" src="resources/js/demo/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="resources/js/jqGridCommInclude.js"></script>
	<script type="text/javascript" src="resources/js/demo/json2.js"></script>
	<script type="text/javascript" src="resources/js/demo/jquery.json.util.js"></script>	
	<script type="text/javascript" src="resources/js/demo/demo.js"></script>


	<script type="text/javascript" src="resources/jqkGrid/js/jqkGridCommInclude.js" ></script>
	<script type="text/javascript" src="resources/js/demo/demoJQKGrid.js"></script>

	<script type="text/javascript">

		
		
		$(document).ready(function(){

			var gData = {
					rowCount : 510,
					rows : [//바인드 될 데이터.. 객체배열 형태..
				             {USER_ID:"1",NAME:"홍길동",ssn:"83XXXX-XXXXXXX",job:"개발자",position:"ㅋㅋㅋ",hobby:"Golf",addr:"서울"},
				             {USER_ID:"2",NAME:"김마리",ssn:"83XXXX-XXXXXXX",job:"개발자",position:"ㅋㅋㅋ",hobby:"Golf",addr:"서울"},
				             {USER_ID:"3",NAME:"박말자",ssn:"83XXXX-XXXXXXX",job:"개발자",position:"ㅋㅋㅋ",hobby:"Golf",addr:"서울"},
				             {USER_ID:"4",NAME:"견미리",ssn:"83XXXX-XXXXXXX",job:"개발자",position:"ㅋㅋㅋ",hobby:"Golf",addr:"서울"},
				             {USER_ID:"1",NAME:"홍길동",ssn:"83XXXX-XXXXXXX",job:"개발자",position:"ㅋㅋㅋ",hobby:"Golf",addr:"서울"},
				             {USER_ID:"2",NAME:"김마리",ssn:"83XXXX-XXXXXXX",job:"개발자",position:"ㅋㅋㅋ",hobby:"Golf",addr:"서울"},
				             {USER_ID:"3",NAME:"박말자",ssn:"83XXXX-XXXXXXX",job:"개발자",position:"ㅋㅋㅋ",hobby:"Golf",addr:"서울"},
				             {USER_ID:"4",NAME:"견미리",ssn:"83XXXX-XXXXXXX",job:"개발자",position:"ㅋㅋㅋ",hobby:"Golf",addr:"서울"},
				             {USER_ID:"1",NAME:"홍길동",ssn:"83XXXX-XXXXXXX",job:"개발자",position:"ㅋㅋㅋ",hobby:"Golf",addr:"서울"},
				             {USER_ID:"2",NAME:"김마리",ssn:"83XXXX-XXXXXXX",job:"개발자",position:"ㅋㅋㅋ",hobby:"Golf",addr:"서울"},
				             {USER_ID:"3",NAME:"박말자",ssn:"83XXXX-XXXXXXX",job:"개발자",position:"ㅋㅋㅋ",hobby:"Golf",addr:"서울"},
				             {USER_ID:"4",NAME:"견미리",ssn:"83XXXX-XXXXXXX",job:"개발자",position:"ㅋㅋㅋ",hobby:"Golf",addr:"서울"}
				 ]};
				$(function(){
					//그리드초기화..
					$(".grid").jqkGrid("init",{
						gridTitle : "나의 첫번째 JQK그리드, My First jqkGrid!!",
						colSizes : [50, 90, 90, 150, 150, 150, 150],//칼럼들의 사이즈는 배열로 표시(픽셀단위)
						headerCells : [[{caption:"No"},{caption:"성명"},{caption:"주민번호"},{caption:"직업"},
						                {caption:"지위"},{caption:"취미"},{caption:"주소"}]], //헤더가 여러줄일수도 있으므로 2중배열로 표시.. columns and rows
						bodyCells : [[{bindCol:"USER_ID"},{bindCol:"NAME"},{bindCol:"ssn"},{bindCol:"job"},
						                {bindCol:"position"},{bindCol:"hobby"},{bindCol:"addr"}]],//마찬가지로 바디가 여러 행일 수 있으니 2중배열로 표시..
						fixedCols : 3,
						none : ""
					});
					//그리드에 데이터를 바인딩..
					$(".grid").jqkGrid("bind",gData);//bind명령, 데이터셋Array, 레코드카운트
				});
			
			
			// 검색
			$('#btn_search2').bind("click", function(){

				// 그리드 초기화
				$("#list2").clearGridData();
				
				var searchData = $("#demoForm").serialize();
				
				$.getJSON('demoJQKGrid/select?' + searchData , function(data) {
					if (data.result == 'SUCCESS') {
						alert(gData.rowCount);
						alert(gData.rows[0].NAME);
						gData = data.resultData;
						alert(gData.rowCount);
						alert(gData.rows[0].NAME);
					} else {
						alert(data.fail_message);
					}
				});
			});
			
		});		
	</script>
</body>
</html>