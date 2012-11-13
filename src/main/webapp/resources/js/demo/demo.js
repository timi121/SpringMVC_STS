
	
$(document).ready(function(){
	$(function(){
		var searchData = $("#demoForm").serialize();
		var searchUrl = 'demo/select?' + searchData;
		
		$("#list2").jqGrid({
			url: 'demo/select',
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

	// 검색
	$('#btn_search').bind("click", function(){

		// 그리드 초기화
		$("#list2").clearGridData();
		
		var searchData = $("#demoForm").serialize();
		
		$.getJSON('demo/select?' + searchData , function(data) {
			if (data.result == 'SUCCESS') {
				$.each(data.list, function(i, n){
					$("#list2").jqGrid('addRowData', i, n);
				});
			} else {
				alert(data.fail_message);
			}

		});
	});

	//  POST
	$("#demoForm").submit(function() {	
		var inData = $("#demoForm").serializeObject();

		$.postJSON("demo/insert", inData, function(data) {
			if (data.result == "SUCCESS") {
				alert("등록 성공");
			} else {
				alert("등록 실패");
			}
		});
		
		return false;				
	});

});