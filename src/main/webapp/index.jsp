<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<html>
<head>
<title>Insert title here</title>
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
		
		<label>user_id : </label><input id="user_id" name="user_id" type="text"> <p>
		<label>inv_date : </label><input id="inv_date" name="inv_date" type="text"><p>
		<label>name : </label><input id="name" name="name" type="text"> <p>
		<label>amount : </label><input id="amount" name="amount" type="text"><p>
		<label>tax : </label><input id="tax" name="tax" type="text"><p>
		<label>total : </label><input id="total" name="total" type="text"> <p>
		<label>note : </label><input id="note" name="note" type="text"><p>		
		<button id="btn_search" type="button">검색 </button>
		<button id="btn_in_post" type="submit">POST</button>
	</form>


	
 	<script type="text/javascript" src="resources/js/demo/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="resources/js/jqGridCommInclude.js"></script>
	<script type="text/javascript" src="resources/js/demo/json2.js"></script>
	<script type="text/javascript" src="resources/js/demo/jquery.json.util.js"></script>	
	<script type="text/javascript" src="resources/js/demo/jquery.json-2.3.js"></script>
	
	<script type="text/javascript" src="resources/js/demo/demo.js"></script>


	<script type="text/javascript">
	$(function(){
		$("#list2").jqGrid({
			url:'demo/demo1',
			datatype: "json",
			colNames:['Inv No','Date', 'Client', 'Amount','Tax','Total','Notes'],
			colModel:[
						{name:'USER_ID',index:'USER_ID', width:55},
						{name:'INV_DATE',index:'INV_DATE', width:90},
						{name:'NAME',index:'NAME asc, INV_DATE', width:100},
						{name:'AMOUNT',index:'AMOUNT', width:80, align:"right"},
						{name:'TAX',index:'TAX', width:80, align:"right"},		
						{name:'TOTAL',index:'TOTAL', width:80,align:"right"},		
						{name:'NOTE',index:'NOTE', width:150, sortable:false}	
			],
			rowNum:10,
			rowList:[10,20,30],
			pager: '#pager2',
			sortname: 'TAX',
			viewrecords: true,
			sortorder: "desc",
			caption:"JSON Example"
		});
		jQuery("#list2").jqGrid('navGrid','#pager2',{edit:true,add:true,del:true});
	});	
	</script>
</body>
</html>