<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>jqkg renderd</title>
	<style>
	
	.jqkg {position: relative; font-size: 11px;}
	.jqkg .jqkg-titlebar {padding: .3em .2em .2em .3em; position: relative; border-left: 0px none;border-right: 0px none; border-top: 0px none;}
	.jqkg .jqkg-title { float: left; margin: .1em 0 .2em; }
	</style>
	
	<script src="resources/js/jqkGridCommInclude.js" type="text/javascript"></script>
	<script type="text/javascript">
	</script>


</head>
<body>

		<div id="jqkGrid" style="WIDTH: 670px;" class="jqkg ui-widget ui-widget-content">
			<!-- 타이틀 -->
			<div class="ui-widget-header ui-helper-clearfix jqkg-titlebar"><SPAN class="jqkg-title">jqk Grid 랜더링</SPAN>
				<!-- 타이틀 우측 아이콘(클릭시 접혀짐 기능 - 굳이 필요할까?) -->
				<SPAN style="RIGHT: 2px;position:absolute" class="ui-icon ui-icon-circle-triangle-n"></SPAN>
			</div>
			<!--//타이틀 -->
			
			<!-- 컨텐트 -->
			<div class="jqkg-content" style="height:200px">
			
				<div class="jqkg-table" style="width:652px;height:182px;position:relative"">
					<div class="jqkg-table-hl">
						<table style="width:200px" cellspacing="0" cellpadding="0">
							<colgroup>
								<col width="50px" />
								<col width="50px"/>
								<col width="100px"/>
							</colgroup>
							<tr>
								<td class="ui-state-default">a</td>
								<td class="ui-state-default">b</td>
								<td class="ui-state-default">c</td>
							</tr>
						</table>
					</div>
					<div class="jqkg-table-hr" style="width:452px">
						<table class="" width="600px" cellspacing="0" cellpadding="0" style="table-layout:fixed">
							<colgroup>
								<col width="100px" />
								<col width="100px"/>
								<col width="100px"/>
								<col width="100px" />
								<col width="100px"/>
								<col width="100px"/>
							</colgroup>
							<tr>
								<td class="ui-state-default">d</td>
								<td class="ui-state-default">e</td>
								<td class="ui-state-default">f</td>
								<td class="ui-state-default">g</td>
								<td class="ui-state-default">h</td>
								<td class="ui-state-default">i</td>
							</tr>
						</table>
					</div>
 					<div class="jqkg-table-bl">
 						<!-- table에도 width를 먹여야 말줄임표가 제대로 나옴 -->
						<table class=""  width="200px" cellspacing="0" cellpadding="0">
							<colgroup>
								<col width="50px" />
								<col width="50px"/>
								<col width="100px"/>
							</colgroup>
							<tr _jqkgRowId="1">
								<td class="ui-widget-content">
									<div class="jqkg-ellipsis">a(변경 후)나는 자랑스러운 태극기 앞에 자유롭고 정의로운 대한민국의 무궁한 발전을 위해 충성을 다할 것을 굳게 다짐합니다.(변경 후)나는 자랑스러운 태극기 앞에 자유롭고 정의로운 대한민국의 무궁한 발전을 위해 충성을 다할 것을 굳게 다짐합니다.</div>
								</td>
								<td class="ui-widget-content">b</td>
								<td class="ui-widget-content">c</td>
							</tr>
							<tr _jqkgRowId="1">
								<td class="ui-widget-content">a</td>
								<td class="ui-widget-content">b</td>
								<td class="ui-widget-content">c</td>
							</tr>
							<tr _jqkgRowId="2">
								<td class="ui-widget-content">a</td>
								<td class="ui-widget-content">b</td>
								<td class="ui-widget-content">c</td>
							</tr>
							<tr _jqkgRowId="2">
								<td class="ui-widget-content">a</td>
								<td class="ui-widget-content">b</td>
								<td class="ui-widget-content">c</td>
							</tr>
							</tunit>
						</table>
					</div>
					<div class="jqkg-table-br" style="width:452px">
						<table class=""  width="600px" cellspacing="0" cellpadding="0">
							<colgroup>
								<col width="100px" />
								<col width="100px"/>
								<col width="100px"/>
								<col width="100px" />
								<col width="100px"/>
								<col width="100px"/>
							</colgroup>
							<tr _jqkgRowId="1">
								<td class="ui-widget-content">d</td>
								<td class="ui-widget-content">e</td>
								<td class="ui-widget-content">f</td>
								<td class="ui-widget-content">g</td>
								<td class="ui-widget-content">h</td>
								<td class="ui-widget-content">i</td>
							</tr>
							<tr _jqkgRowId="1">
								<td class="ui-widget-content">d</td>
								<td class="ui-widget-content">e</td>
								<td class="ui-widget-content">f</td>
								<td class="ui-widget-content">g</td>
								<td class="ui-widget-content">h</td>
								<td class="ui-widget-content">i</td>
							</tr>
							<tr _jqkgRowId="2">
								<td class="ui-widget-content">d</td>
								<td class="ui-widget-content">e</td>
								<td class="ui-widget-content">f</td>
								<td class="ui-widget-content">g</td>
								<td class="ui-widget-content">h</td>
								<td class="ui-widget-content">i</td>
							</tr>
							<tr _jqkgRowId="2">
								<td class="ui-widget-content">d</td>
								<td class="ui-widget-content">e</td>
								<td class="ui-widget-content">f</td>
								<td class="ui-widget-content">g</td>
								<td class="ui-widget-content">h</td>
								<td class="ui-widget-content">i</td>
							</tr>
						</table>
					</div> 

					<!--당장 푸터기능을 구현할 필요는 없겠지... 
					<div class="jqkg-table-fl"></div>
					<div class="jqkg-table-fr"></div>
					 -->
				</div>
				<div class="jqkg-vscroll" style="height:182px">
					<div class="jqkg-vscroll-in" style="height:182px">
						<div class="jqkg-vscroll-inin" style="height:500px;"></div>
					</div>
				</div>
				<div class="jqkg-hscroll" style="width:100%">
					<div class="jqkg-hscroll-in" style="height:18px;width:100%">
						<div class="jqkg-hscroll-inin" style="width:800px;"></div>
					</div>
				</div>
			</div>
			<!--
			<div class=ui-jqgrid-hbox>
			<TABLE style="WIDTH: 652px" class=ui-jqgrid-htable role=grid
				aria-labelledby=gbox_list2 border=0 cellSpacing=0 cellPadding=0>
				<THEAD>
					<TR class=ui-jqgrid-labels role=rowheader
						jQuery17209364034856311034="22">
						<TH style="WIDTH: 53px" id=list2_id
							class="ui-state-default ui-th-column ui-th-ltr" role=columnheader
							jQuery17209364034856311034="3">
						<div id=jqgh_list2_id class="ui-th-div-ie ui-jqgrid-sortable">Inv No</div>
						</TH>
						<TH style="WIDTH: 87px" id=list2_invdate
							class="ui-state-default ui-th-column ui-th-ltr" role=columnheader
							jQuery17209364034856311034="4"><SPAN style="CURSOR: col-resize"
							class="ui-jqgrid-resize ui-jqgrid-resize-ltr">&nbsp;</SPAN>
						<div id=jqgh_list2_invdate class="ui-th-div-ie ui-jqgrid-sortable">Date<SPAN
							style="DISPLAY: none" class=s-ico><SPAN
							class="ui-grid-ico-sort ui-icon-asc ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-ltr"
							sort="asc"></SPAN><SPAN
							class="ui-grid-ico-sort ui-icon-desc ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-ltr"
							sort="desc"></SPAN></SPAN></div>
						</TH>
						<TH style="WIDTH: 97px" id=list2_name
							class="ui-state-default ui-th-column ui-th-ltr" role=columnheader
							jQuery17209364034856311034="5"><SPAN style="CURSOR: col-resize"
							class="ui-jqgrid-resize ui-jqgrid-resize-ltr">&nbsp;</SPAN>
						<div id=jqgh_list2_name class="ui-th-div-ie ui-jqgrid-sortable">Client<SPAN
							style="DISPLAY: none" class=s-ico><SPAN
							class="ui-grid-ico-sort ui-icon-asc ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-ltr"
							sort="asc"></SPAN><SPAN
							class="ui-grid-ico-sort ui-icon-desc ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-ltr"
							sort="desc"></SPAN></SPAN></div>
						</TH>
						<TH style="WIDTH: 78px" id=list2_amount
							class="ui-state-default ui-th-column ui-th-ltr" role=columnheader
							jQuery17209364034856311034="6"><SPAN style="CURSOR: col-resize"
							class="ui-jqgrid-resize ui-jqgrid-resize-ltr">&nbsp;</SPAN>
						<div id=jqgh_list2_amount class="ui-th-div-ie ui-jqgrid-sortable">Amount<SPAN
							style="DISPLAY: none" class=s-ico><SPAN
							class="ui-grid-ico-sort ui-icon-asc ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-ltr"
							sort="asc"></SPAN><SPAN
							class="ui-grid-ico-sort ui-icon-desc ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-ltr"
							sort="desc"></SPAN></SPAN></div>
						</TH>
						<TH style="WIDTH: 78px" id=list2_tax
							class="ui-state-default ui-th-column ui-th-ltr" role=columnheader
							jQuery17209364034856311034="7"><SPAN style="CURSOR: col-resize"
							class="ui-jqgrid-resize ui-jqgrid-resize-ltr">&nbsp;</SPAN>
						<div id=jqgh_list2_tax class="ui-th-div-ie ui-jqgrid-sortable">Tax<SPAN
							style="DISPLAY: none" class=s-ico><SPAN
							class="ui-grid-ico-sort ui-icon-asc ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-ltr"
							sort="asc"></SPAN><SPAN
							class="ui-grid-ico-sort ui-icon-desc ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-ltr"
							sort="desc"></SPAN></SPAN></div>
						</TH>
						<TH style="WIDTH: 78px" id=list2_total
							class="ui-state-default ui-th-column ui-th-ltr" role=columnheader
							jQuery17209364034856311034="8"><SPAN style="CURSOR: col-resize"
							class="ui-jqgrid-resize ui-jqgrid-resize-ltr">&nbsp;</SPAN>
						<div id=jqgh_list2_total class="ui-th-div-ie ui-jqgrid-sortable">Total<SPAN
							style="DISPLAY: none" class=s-ico><SPAN
							class="ui-grid-ico-sort ui-icon-asc ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-ltr"
							sort="asc"></SPAN><SPAN
							class="ui-grid-ico-sort ui-icon-desc ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-ltr"
							sort="desc"></SPAN></SPAN></div>
						</TH>
						<TH style="WIDTH: 146px" id=list2_note
							class="ui-state-default ui-th-column ui-th-ltr" role=columnheader
							jQuery17209364034856311034="9"><SPAN style="CURSOR: col-resize"
							class="ui-jqgrid-resize ui-jqgrid-resize-ltr">&nbsp;</SPAN>
						<div id=jqgh_list2_note class="ui-th-div-ie ui-jqgrid-sortable">Notes<SPAN
							style="DISPLAY: none" class=s-ico><SPAN
							class="ui-grid-ico-sort ui-icon-asc ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-ltr"
							sort="asc"></SPAN><SPAN
							class="ui-grid-ico-sort ui-icon-desc ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-ltr"
							sort="desc"></SPAN></SPAN></div>
						</TH>
					</TR>
				</THEAD>
			</TABLE>
			</div>
			<!-- /테이블헤더 -->
			<!-- 페이저부분 -->
			<div style="position:relative;bottom:0px;" class="ui-state-default ui-helper-clearfix jqkg-pager">
			<!-- 
			<TABLE style="WIDTH: 100%; TABLE-LAYOUT: fixed; HEIGHT: 100%"
				class=ui-pg-table role=row border=0 cellSpacing=0 cellPadding=0>
				<TBODY>
					<TR>
						<TD id=pager2_left align=left>
						<TABLE style="FLOAT: left; TABLE-LAYOUT: auto"
							class="ui-pg-table navtable" border=0 cellSpacing=0 cellPadding=0>
							<TBODY>
								<TR>
									<TD id=search_list2 class="ui-pg-button ui-corner-all"
										title="Find records" jQuery17209364034856311034="24">
									<div class=ui-pg-div><SPAN class="ui-icon ui-icon-search"></SPAN></div>
									</TD>
									<TD id=refresh_list2 class="ui-pg-button ui-corner-all"
										title="Reload Grid" jQuery17209364034856311034="25">
									<div class=ui-pg-div><SPAN class="ui-icon ui-icon-refresh"></SPAN></div>
									</TD>
								</TR>
							</TBODY>
						</TABLE>
						</TD>
						<TD style="WIDTH: 255px; " id=pager2_center align=middle>
						<TABLE style="TABLE-LAYOUT: auto" class=ui-pg-table border=0
							cellSpacing=0 cellPadding=0>
							<TBODY>
								<TR>
									<TD id=first_pager2
										class="ui-pg-button ui-corner-all ui-state-disabled"
										jQuery17209364034856311034="11"><SPAN
										class="ui-icon ui-icon-seek-first"></SPAN></TD>
									<TD id=prev_pager2
										class="ui-pg-button ui-corner-all ui-state-disabled"
										jQuery17209364034856311034="12"><SPAN
										class="ui-icon ui-icon-seek-prev"></SPAN></TD>
									<TD style="WIDTH: 4px" class="ui-pg-button ui-state-disabled"
										jQuery17209364034856311034="13"><SPAN class=ui-separator></SPAN></TD>
									<TD dir=ltr>Page <INPUT class=ui-pg-input role=textbox
										value=1 maxLength=7 size=2 type=text
										jQuery17209364034856311034="17"> of <SPAN id=sp_1_pager2>2</SPAN></TD>
									<TD style="WIDTH: 4px" class="ui-pg-button ui-state-disabled"
										jQuery17209364034856311034="14"><SPAN class=ui-separator></SPAN></TD>
									<TD id=next_pager2 class="ui-pg-button ui-corner-all"
										jQuery17209364034856311034="15"><SPAN
										class="ui-icon ui-icon-seek-next"></SPAN></TD>
									<TD id=last_pager2 class="ui-pg-button ui-corner-all"
										jQuery17209364034856311034="16"><SPAN
										class="ui-icon ui-icon-seek-end"></SPAN></TD>
									<TD dir=ltr><SELECT class=ui-pg-selbox role=listbox
										jQuery17209364034856311034="10">
										<OPTION role=option selected value=10>10</OPTION>
										<OPTION role=option value=20>20</OPTION>
										<OPTION role=option value=30>30</OPTION>
									</SELECT></TD>
								</TR>
							</TBODY>
						</TABLE>
						</TD>
						<TD id=pager2_right align=right>
						<div style="TEXT-ALIGN: right" dir=ltr class=ui-paging-info>View
						1 - 10 of 13</div>
						</TD>
					</TR>
				</TBODY>
			</TABLE>
			 -->abbcde
			</div>
			<!-- /페이저부분 -->
		</div>
		<!-- /jqk Grid -->
		
		
		


		


</body>

</html>
