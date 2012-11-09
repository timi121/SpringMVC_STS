
	
$(document).ready(function(){


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