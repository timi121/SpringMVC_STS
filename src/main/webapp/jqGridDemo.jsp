<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>jqGrid Demos</title>
	<script src="resources/js/jqGridCommInclude.js" type="text/javascript"></script>
	<script type="text/javascript">
		$(function(){
			$("#list2").jqGrid({
				url:'resources/data.data?q=2',
				datatype: "json",
				colNames:['Inv No','Date', 'Client', 'Amount','Tax','Total','Notes'],
				colModel:[
					{name:'id',index:'id', width:55},
					{name:'invdate',index:'invdate', width:90},
					{name:'name',index:'name asc, invdate', width:100},
					{name:'amount',index:'amount', width:80, align:"right"},
					{name:'tax',index:'tax', width:80, align:"right"},		
					{name:'total',index:'total', width:80,align:"right"},		
					{name:'note',index:'note', width:150, sortable:false}		
				],
				rowNum:10,
				rowList:[10,20,30],
				pager: '#pager2',
				sortname: 'id',
				viewrecords: true,
				sortorder: "desc",
				caption:"JSON Example"
			});
			jQuery("#list2").jqGrid('navGrid','#pager2',{edit:false,add:false,del:false});
		});
	
	</script>


</head>
<body>

		<table id="list2"></table>
		<div id="pager2" ></div>



</body>

</html>
