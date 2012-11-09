/*
//의존성 (dependancy)
//1 jQuery
//2 jQueryUI and theme
//2 jLinq

- 현재까지 구현된 기능
	초기화, jQuery UI의 테마적용
	데이타바인딩
	Fixed Column
	
- 구현해야 할 기능(우선순위에 따라)

	페이징
	[CRUD]Row Selection(이벤트핸들러추가)
	[CRUD]Row Editing
	[CRUD]Row Add and Delete
	[CRUD]다중선택(멀티삭제 삭제할때만 쓰지 않나?)
	[CRUD]Edited data transfer(저장기능..)
	
	Column Sizing
	Sort Order기능(엔터프라이즈 환경에선 별로..)
	
- 기타 jQuery Tab 기능을 활용한 MDI 구현?

*/


(function($) {
"use strict";
//그리드컨트롤 시작[

/*
객체공통부분과 플러그인함수들을 jqkGrid객체 하나로 합치려고 했으나..
$.fn.jqGrid.init = function() {...}; 
이런 식으로 정의해보고 싶은데 에러가 난다 

$.jqGrid = {}
$.fn.jqGrid = {}
이런식으로 두가지 플러그인에 똑같은 명명을 해도 되긴 하다... 
*/

//jqkGrid의 공통사항을 정리한 객체 버전, 기본설정값, 기본처리메소드 등
$.jqkGridComm = $.jqkGridComm || {};
$.extend($.jqkGridComm,{
	version:"0.0.1",
	//디폴트설정
	defaultGridConfig : {
		height: 250, //그리드의 default height
		width: 500, //그리드의 default width
		gridTitle : "Sample Grid",
		multiSelect : false, //다중선택 여부
		colSizes : [], 
		headerCells : [[]],
		fixedCols : 0, //틀고정칼럼 갯수
		none : ""
	},
	defaultBodyCell : {
		bindCol : ""
	},
	/////////////////////////////////
	//공통함수 
	/////////////////////////////////
	//그리드의 내부 엘리먼트 중의 하나를 받아서 해당 엘리먼트를 관장하는 컨테이너 그리드객체를 리턴
	//파라메터는 엘리먼트객체나 셀렉터식을 줄수 있다.
	getGrid : function(element){
		var jqElement = $(element);
		for(var i=0;i<30;i++){
			if(jqElement.hasClass("jqkg")) return jqElement;
			jqElement = jqElement.parent();
		}
		return null;
	},
	///////////////////////////////////////
	//처리함수
	//규칙 :첫번째 아규먼트는 그리드객체 자체.. 두번째 아규먼트는 인자값을 단독 또는 json타입으로 엮어서 전달함
	///////////////////////////////////////
	//그리드초기화메소드(그리드 구성시 한 번만 실행한다.)
	init : function(gridSelector, config){
		//기본 컨테이너는 div엘리먼트만 올 수 있다.
		if(!gridSelector.tagName || gridSelector.tagName.toUpperCase()!='DIV') {
			alert("컨테이너는 DIV 태그만 설정할 수 있습니다.");
			return;
		}
		var $grid = $(gridSelector);
		//설정값
		config = $.extend(true, $.jqkGridComm.defaultGridConfig, config||{});
		//Fixedcol width 구한다(랜더링시 필요함)
		var fixedColsWidth = 0, unFixedColsWidth = 0;
		for(var i=0;i<config.colSizes.length;i++){
			if(i<config.fixedCols) fixedColsWidth += (config.colSizes[i]-0);
			else unFixedColsWidth += (config.colSizes[i]-0);
		}
		$grid.data("config",config);//설정값을 그리드 엘리먼트객체에 저장
		//자.. 랜더링하자..
		//기본와꾸
		$grid.addClass("jqkg").addClass("ui-widget").addClass("ui-widget-content")
			.css({width:config.width,height:config.height})
			//타이틀바를 달아주자..
			.append("<div class='ui-widget-header ui-helper-clearfix jqkg-titlebar'>"+
					"<SPAN class='jqkg-title'>"+config.gridTitle+"</SPAN>"+ 
					"<SPAN style='RIGHT: 2px;position:absolute' class='ui-icon ui-icon-circle-triangle-n'></SPAN>"+
					"</div>")
			//내용을 달아주자..
			.append(" \
				<div class='jqkg-content' style='height:"+(config.height-50)+"px;'>  \
					<div class='jqkg-table' style='width:"+(config.width-18)+"px;height:"+(config.height-68)+"px;position:relative'>  \
						<div class='jqkg-table-hl' style='width:"+fixedColsWidth+"px'>  \
							<table style='width:"+fixedColsWidth+"px' cellspacing='0' cellpadding='0'>  \
							<colgroup></colgroup></table></div>  \
						<div class='jqkg-table-hr' style='width:"+(config.width-fixedColsWidth-18)+"px'>  \
							<table style='width:"+unFixedColsWidth+"px' cellspacing='0' cellpadding='0'>  \
							<colgroup></colgroup></table></div>  \
	 					<div class='jqkg-table-bl' style='width:"+fixedColsWidth+"px'>   \
	 						<table style='width:"+fixedColsWidth+"px' cellspacing='0' cellpadding='0'>  \
							<colgroup></colgroup></table></div>  \
						<div class='jqkg-table-br' style='width:"+(config.width-fixedColsWidth-18)+"px'>  \
							<table style='width:"+unFixedColsWidth+"px' cellspacing='0' cellpadding='0'>  \
							<colgroup></colgroup></table></div>  \
						<div class='jqkg-table-fl'></div>  \
						<div class='jqkg-table-fr'></div>  \
					</div>  \
					<div class='jqkg-vscroll' style='height:"+(config.height-68)+"px;'>  \
						<div class='jqkg-vscroll-in' style='height:100%'>  \
							<div class='jqkg-vscroll-inin' style='height:1px;width:1px'></div>  \
						</div>  \
					</div>  \
					<div class='jqkg-hscroll' style='width:100%'>  \
						<div class='jqkg-hscroll-in' style='height:18px;width:"+(config.width-fixedColsWidth-18)+"px;left:"+fixedColsWidth+"px'>  \
							<div class='jqkg-hscroll-inin' style='height:1px;width:"+ unFixedColsWidth +"px'></div>  \
						</div>  \
					</div>  \
				</div>")
				//페이저를 달아주자..
			.append("<div style='position:relative;bottom:0px;' class='ui-state-default ui-helper-clearfix jqkg-pager'>페이저부분</div>");
		//colGroup을 셋팅해준다.(TODO : footer columns 추가)
		for(var i=0;i<config.colSizes.length;i++){
			if(i<config.fixedCols) {
				$grid.find(".jqkg-table-hl table colgroup").append("<col width='"+config.colSizes[i]+"px'/>");
				$grid.find(".jqkg-table-bl table colgroup").append("<col width='"+config.colSizes[i]+"px'/>");
			} else {
				$grid.find(".jqkg-table-hr table colgroup").append("<col width='"+config.colSizes[i]+"px'/>");
				$grid.find(".jqkg-table-br table colgroup").append("<col width='"+config.colSizes[i]+"px'/>");
			}
		}
		//그리드 헤더 TR을 넣어준다.
		for(var i=0;i<config.headerCells.length;i++){// 헤더로우 수만큼 루핑//일반적으로는 1개..
			var cells = config.headerCells[i];
			var $trFixed = $("<tr/>");
			var $trUnFixed = $("<tr/>");
			for(var j=0;j<cells.length;j++){
				var sTd = "<td class='ui-state-default'><div class='jqkg-ellipsis'>"+ cells[j].caption +"</td>"; 
				if(j<config.fixedCols)$trFixed.append(sTd);
				else $trUnFixed.append(sTd);
			}
			$grid.find(".jqkg-table-hl table").append($trFixed);
			$grid.find(".jqkg-table-hr table").append($trUnFixed);
		}
		//헤더를 제외한 나머지 영역으로 바디영역을 잡아준다(TODO:추후 푸터가 구현되면 이 부분도 처리 필요);
		$grid.find(".jqkg-table-bl,.jqkg-table-br").css("top",
			$grid.find(".jqkg-table-hr").prop("offsetHeight")
		).css("height",
			$grid.find(".jqkg-table").prop("offsetHeight")-$grid.find(".jqkg-table-hr").prop("offsetHeight")
		);
		
		//세로 스크롤바의 위치를 잡아준다.
		//alert($grid.find(".jqkg-vscroll").prop("offsetHeight")-$grid.find(".jqkg-table-hl").prop("offsetHeight"));
		$grid.find(".jqkg-vscroll-in").css("height", 
				$grid.find(".jqkg-vscroll").prop("offsetHeight")-$grid.find(".jqkg-table-hr").prop("offsetHeight")
		).css("top", $grid.find(".jqkg-table-hr").prop("offsetHeight"));
		
		//scroll이벤트가 live로 안먹히니까 정적으로 박아준다(추후 해결되면 아래의 동적이벤트에서 처리할 수 있음)
		$grid.find(".jqkg-hscroll-in").on("scroll",function(){
			$grid.find(".jqkg-table-hr").scrollLeft(this.scrollLeft);
			$grid.find(".jqkg-table-br").scrollLeft(this.scrollLeft);
		});
		$grid.find(".jqkg-vscroll-in").on("scroll",function(){
			$grid.find(".jqkg-table-bl").scrollTop(this.scrollTop);
			$grid.find(".jqkg-table-br").scrollTop(this.scrollTop);
		});
//		$grid.find(".jqkg-table-bl,.jqkg-table-br").on("mousedown",function(){
//			alert('tt');
//		});
		//$(document).on('scroll',
	},
	//데이터를 바인딩시킨다.
	bind : function(gridSelector, dataSet){

		var $grid = $(gridSelector);

		//data의 갯수만큼 돌면서 그리드의 바디를 채워줌
		for(var i =0;i<dataSet.length;i++){
			data = dataSet[i];
			data["_jqkgRowId"] = i;//row id
			data["_jqkgRowStat"] = "R";//Read, Updated, Deleted, Created
		}
		
		$grid.data("dataOrigin",dataSet); //객체가 복사가 되는지 참조만 되는지는 추후 
		$grid.data("data",dataSet);
		
		//참조복사가 되는 문제.. => 개선해야 함.. jQuery의 clone사용하면 배열이 이상하게 됨..
		$grid.data("data")[0]["a"] = "abc";
		alert($grid.data("dataOrigin")[0]["a"] );
		
		//alert(JSON.stringify(dataSet));
		//alert(JSON.stringify($grid.data("data")));
		$.jqkGridComm.generateBody(gridSelector);
	},
	reset :  function(gridSelector){ //TODO수정기능작업 후에 잘 돌아가는지 테스트...
		
		var $grid = $(gridSelector);
		//일단은 기바인딩된 현재의 데이터 Row들을 털어버린다. 
		$grid.find(".jqkg-table-bl table tr,.jqkg-table-br table tr").remove();
		
		$grid.data("dataOrigin",$.extend({},dataSet));
		$grid.data("data",$.extend({},$grid.data("dataOrigin")));
		
		$.jqkGridComm.generateBody(gridSelector);
	},
	generateBody : function(gridSelector){
		var $grid = $(gridSelector);
		
		$grid.find(".jqkg-table-bl table tr,.jqkg-table-br table tr").remove();//기바인딩된 현재의 데이터 Row들을 털어버린다. 
		
		var dataSet = $grid.data("data");
		var config = $grid.data("config");

		for(var i =0;i<dataSet.length;i++){//defaultBodyCell
			data = dataSet[i];
			for(var j=0;j<config.bodyCells.length;j++){// 바디Row만큼 루핑//일반적으로는 1개..
				var cells = config.bodyCells[j];
				var $trFixed = $("<tr _jqkgRowId='"+ data["_jqkgRowId"] +"'/>");
				var $trUnFixed = $("<tr _jqkgRowId='"+ data["_jqkgRowId"] +"'/>");
				for(var k=0;k<cells.length;k++){
					var sTd = "<td class='ui-widget-content'><div class='jqkg-ellipsis'>"+ data[cells[k].bindCol] +"</td>"; 
					if(k<config.fixedCols)$trFixed.append(sTd);
					else $trUnFixed.append(sTd);
				}
				$grid.find(".jqkg-table-bl table").append($trFixed);
				$grid.find(".jqkg-table-br table").append($trUnFixed);
			}
		}
		//세로스크롤의 스크롤크기를 잡아준다.
		$grid.find(".jqkg-vscroll-inin").css("height", $grid.find(".jqkg-table-br table").prop("offsetHeight"));
	},
	none:""
});
//////////////////////////////////////////////
//기본적인 이벤트를 잡아준다. LIVE이벤트이기 때문에 플러그인에 엮일 필요는 없다.
// jQuery의 live메소드는 deprecated되었다고 하니 통합된 on메소드를 애용해주자..
///////////////////////////////////////////////
//셀 관련 이벤트
$(document).on("mouseover", ".jqkg-table-bl table td, .jqkg-table-br table td", function(){//마우스오버(hover클래스추가)
	//일단 빼보자
	if($(this).hasClass("ui-state-active")||$(this).hasClass("ui-state-hover")) return;
	var rowId = $(this).parent().attr("_jqkgRowId");
	//그리드 찾기
	var $grd = $.jqkGridComm.getGrid(this);
	//$grd.find(".jqkg-table-bl table td, .jqkg-table-br table td").removeClass("ui-state-hover");
	$grd.find("tr[_jqkgRowId='"+rowId+"'] td").addClass("ui-state-hover");
});
$(document).on("mouseout", ".jqkg-table-bl table td, .jqkg-table-br table td", function(){//마우스아웃(hover클래스 삭제)
	if(!$(this).hasClass("ui-state-hover")) return;
	var rowId = $(this).parent().attr("_jqkgRowId");
	//그리드 찾기
	var $grd = $.jqkGridComm.getGrid(this);
	//$grd.find(".jqkg-table-bl table td, .jqkg-table-br table td").removeClass("ui-state-hover");
	$grd.find("tr[_jqkgRowId='"+rowId+"'] td").removeClass("ui-state-hover");
});
$(document).on("click", ".jqkg-table-bl table td, .jqkg-table-br table td", function(){//마우스클릭(active 클래스추가)
	if($(this).hasClass("ui-state-active")) return;	
	var rowId = $(this).parent().attr("_jqkgRowId");
	//그리드 찾기
	var $grd = $.jqkGridComm.getGrid(this);
	$grd.find(".jqkg-table-bl table td, .jqkg-table-br table td").removeClass("ui-state-active");
	$grd.find("tr[_jqkgRowId='"+rowId+"'] td").addClass("ui-state-active");
});

////스크롤이벤트
$(window).on("scroll",".jqkg-hscroll-in", function(){
	alert('tt');
});
$(window).on('scroll', '.jqkg-hscroll-in', function() {
	alert('abcd');
});
//아이콘 관련 이벤트
/* 이미지 깨짐.. 우선순위 낮으니 추후 구현..
$(".jqkg-icon").live("mouseover",function(){
	$(this).addClass("ui-state-active");
}).live("mouseout",function(){
	$(this).removeClass("ui-state-active");
});
*/



/*
//이건 테스트로 함 해본거
$.fn.jqkGrid = function( a ) {
  return this.each(function() {
    $('body').append(a + '<div>Purchase: ' + this.innerHTML + '</div>');
  });
};
*/

$.fn.jqkGrid = function() {
	//우선 파라메터를 받는다. 
	//규칙.. 첫번째 파라메터는 실행할 메소드(명령, function객체 ID를 string타입으로만 받음..)
	//두번째 파라메터는 실행할 인자들을 json객체 타입으로 받는다..)
	var param = arguments;
	if(arguments.length < 1 || typeof arguments[0] != 'string') {
		//추후에는 typeof $.jqkGridComm[param[0]] != 'function'  추가??
		alert("그러한 명령(함수)이 없습니다. - " + arguments[0]||"");
		return;
	}
	
	var method = $.jqkGridComm[arguments[0]];
	//아규먼트를 배열로 만든다.
	var param = $.makeArray(arguments);//arguments[1]||"";

	return this.each( function() {
		param[0] = this;//첫번째 아규먼트(메소드명에 해당)을 this로 치환한다.
		method.apply(this, param);
	});
	
	return;
	//이 이후에 뭐가 올 수 있을까? 아래는 아직 참조용으로 남겨둠..
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//초기화의 경우
	return this.each( function() {

		//이미 그리드초기화가 되었다면 return 하겠다는 뜻?
		//이런 식으로 dom객체에 직접 추가적으로 필요한 객체들을 setting해서 사용하는 것이 바람직 할까?
		if(this.grid) {return;}

		// param?? p:상태? 설정값??
		var p = $.extend(true,{
			url: "",
			height: 150,
			page: 1,
			rowNum: 20,
			rowTotal : null,
			records: 0,
			pager: "",
			pgbuttons: true,
			pginput: true,
			colModel: [],
			rowList: [],
			colNames: [],
			sortorder: "asc",
			sortname: "",
			datatype: "xml",
			mtype: "GET",
			altRows: false,
			selarrrow: [],
			savedRow: [],
			shrinkToFit: true,
			xmlReader: {},
			jsonReader: {},
			subGrid: false,
			subGridModel :[],
			reccount: 0,
			lastpage: 0,
			lastsort: 0,
			selrow: null,
			beforeSelectRow: null,
			onSelectRow: null,
			onSortCol: null,
			ondblClickRow: null,
			onRightClickRow: null,
			onPaging: null,
			onSelectAll: null,
			loadComplete: null,
			gridComplete: null,
			loadError: null,
			loadBeforeSend: null,
			afterInsertRow: null,
			beforeRequest: null,
			beforeProcessing : null,
			onHeaderClick: null,
			viewrecords: false,
			loadonce: false,
			multiselect: false,
			multikey: false,
			editurl: null,
			search: false,
			caption: "",
			hidegrid: true,
			hiddengrid: false,
			postData: {},
			userData: {},
			treeGrid : false,
			treeGridModel : 'nested',
			treeReader : {},
			treeANode : -1,
			ExpandColumn: null,
			tree_root_level : 0,
			prmNames: {page:"page",rows:"rows", sort: "sidx",order: "sord", search:"_search", nd:"nd", id:"id",oper:"oper",editoper:"edit",addoper:"add",deloper:"del", subgridid:"id", npage: null, totalrows:"totalrows"},
			forceFit : false,
			gridstate : "visible",
			cellEdit: false,
			cellsubmit: "remote",
			nv:0,
			loadui: "enable",
			toolbar: [false,""],
			scroll: false,
			multiboxonly : false,
			deselectAfterSort : true,
			scrollrows : false,
			autowidth: false,
			scrollOffset :18,
			cellLayout: 5,
			subGridWidth: 20,
			multiselectWidth: 20,
			gridview: false,
			rownumWidth: 25,
			rownumbers : false,
			pagerpos: 'center',
			recordpos: 'right',
			footerrow : false,
			userDataOnFooter : false,
			hoverrows : true,
			altclass : 'ui-priority-secondary',
			viewsortcols : [false,'vertical',true],
			resizeclass : '',
			autoencode : false,
			remapColumns : [],
			ajaxGridOptions :{},
			direction : "ltr",
			toppager: false,
			headertitles: false,
			scrollTimeout: 40,
			data : [],
			_index : {},
			grouping : false,
			groupingView : {groupField:[],groupOrder:[], groupText:[],groupColumnShow:[],groupSummary:[], showSummaryOnHide: false, sortitems:[], sortnames:[], groupDataSorted : false, summary:[],summaryval:[], plusicon: 'ui-icon-circlesmall-plus', minusicon: 'ui-icon-circlesmall-minus'},
			ignoreCase : false,
			cmTemplate : {},
			idPrefix : ""
		}, $.jgrid.defaults, pin || {});
		var ts = this;
		var grid = {
			headers:[],
			cols:[],
			footers: [],
			dragStart: function(i,x,y) {
				this.resizing = { idx: i, startX: x.clientX, sOL : y[0]};
				this.hDiv.style.cursor = "col-resize";
				this.curGbox = $("#rs_m"+$.jgrid.jqID(p.id),"#gbox_"+$.jgrid.jqID(p.id));
				this.curGbox.css({display:"block",left:y[0],top:y[1],height:y[2]});
				$(ts).triggerHandler("jqGridResizeStart", [x, i]);
				if($.isFunction(p.resizeStart)) { p.resizeStart.call(this,x,i); }
				document.onselectstart=function(){return false;};
			},
			dragMove: function(x) {
				if(this.resizing) {
					var diff = x.clientX-this.resizing.startX,
					h = this.headers[this.resizing.idx],
					newWidth = p.direction === "ltr" ? h.width + diff : h.width - diff, hn, nWn;
					if(newWidth > 33) {
						this.curGbox.css({left:this.resizing.sOL+diff});
						if(p.forceFit===true ){
							hn = this.headers[this.resizing.idx+p.nv];
							nWn = p.direction === "ltr" ? hn.width - diff : hn.width + diff;
							if(nWn >33) {
								h.newWidth = newWidth;
								hn.newWidth = nWn;
							}
						} else {
							this.newWidth = p.direction === "ltr" ? p.tblwidth+diff : p.tblwidth-diff;
							h.newWidth = newWidth;
						}
					}
				}
			},
			dragEnd: function() {
				this.hDiv.style.cursor = "default";
				if(this.resizing) {
					var idx = this.resizing.idx,
					nw = this.headers[idx].newWidth || this.headers[idx].width;
					nw = parseInt(nw,10);
					this.resizing = false;
					$("#rs_m"+$.jgrid.jqID(p.id)).css("display","none");
					p.colModel[idx].width = nw;
					this.headers[idx].width = nw;
					this.headers[idx].el.style.width = nw + "px";
					this.cols[idx].style.width = nw+"px";
					if(this.footers.length>0) {this.footers[idx].style.width = nw+"px";}
					if(p.forceFit===true){
						nw = this.headers[idx+p.nv].newWidth || this.headers[idx+p.nv].width;
						this.headers[idx+p.nv].width = nw;
						this.headers[idx+p.nv].el.style.width = nw + "px";
						this.cols[idx+p.nv].style.width = nw+"px";
						if(this.footers.length>0) {this.footers[idx+p.nv].style.width = nw+"px";}
						p.colModel[idx+p.nv].width = nw;
					} else {
						p.tblwidth = this.newWidth || p.tblwidth;
						$('table:first',this.bDiv).css("width",p.tblwidth+"px");
						$('table:first',this.hDiv).css("width",p.tblwidth+"px");
						this.hDiv.scrollLeft = this.bDiv.scrollLeft;
						if(p.footerrow) {
							$('table:first',this.sDiv).css("width",p.tblwidth+"px");
							this.sDiv.scrollLeft = this.bDiv.scrollLeft;
						}
					}
					$(ts).triggerHandler("jqGridResizeStop", [nw, idx]);
					if($.isFunction(p.resizeStop)) { p.resizeStop.call(this,nw,idx); }
				}
				this.curGbox = null;
				document.onselectstart=function(){return true;};
			},
			populateVisible: function() {
				if (grid.timer) { clearTimeout(grid.timer); }
				grid.timer = null;
				var dh = $(grid.bDiv).height();
				if (!dh) { return; }
				var table = $("table:first", grid.bDiv);
				var rows, rh;
				if(table[0].rows.length) {
					try {
						rows = table[0].rows[1];
						rh = rows ? $(rows).outerHeight() || grid.prevRowHeight : grid.prevRowHeight;
					} catch (pv) {
						rh = grid.prevRowHeight;
					}
				}
				if (!rh) { return; }
				grid.prevRowHeight = rh;
				var rn = p.rowNum;
				var scrollTop = grid.scrollTop = grid.bDiv.scrollTop;
				var ttop = Math.round(table.position().top) - scrollTop;
				var tbot = ttop + table.height();
				var div = rh * rn;
				var page, npage, empty;
				if ( tbot < dh && ttop <= 0 &&
					(p.lastpage===undefined||parseInt((tbot + scrollTop + div - 1) / div,10) <= p.lastpage))
				{
					npage = parseInt((dh - tbot + div - 1) / div,10);
					if (tbot >= 0 || npage < 2 || p.scroll === true) {
						page = Math.round((tbot + scrollTop) / div) + 1;
						ttop = -1;
					} else {
						ttop = 1;
					}
				}
				if (ttop > 0) {
					page = parseInt(scrollTop / div,10) + 1;
					npage = parseInt((scrollTop + dh) / div,10) + 2 - page;
					empty = true;
				}
				if (npage) {
					if (p.lastpage && page > p.lastpage || p.lastpage==1 || (page === p.page && page===p.lastpage) ) {
						return;
					}
					if (grid.hDiv.loading) {
						grid.timer = setTimeout(grid.populateVisible, p.scrollTimeout);
					} else {
						p.page = page;
						if (empty) {
							grid.selectionPreserver(table[0]);
							grid.emptyRows(grid.bDiv,false, false);
						}
						grid.populate(npage);
					}
				}
			},
			scrollGrid: function( e ) {
				if(p.scroll) {
					var scrollTop = grid.bDiv.scrollTop;
					if(grid.scrollTop === undefined) { grid.scrollTop = 0; }
					if (scrollTop != grid.scrollTop) {
						grid.scrollTop = scrollTop;
						if (grid.timer) { clearTimeout(grid.timer); }
						grid.timer = setTimeout(grid.populateVisible, p.scrollTimeout);
					}
				}
				grid.hDiv.scrollLeft = grid.bDiv.scrollLeft;
				if(p.footerrow) {
					grid.sDiv.scrollLeft = grid.bDiv.scrollLeft;
				}
				if( e ) { e.stopPropagation(); }
			},
			selectionPreserver : function(ts) {
				var p = ts.p,
				sr = p.selrow, sra = p.selarrrow ? $.makeArray(p.selarrrow) : null,
				left = ts.grid.bDiv.scrollLeft,
				restoreSelection = function() {
					var i;
					p.selrow = null;
					p.selarrrow = [];
					if(p.multiselect && sra && sra.length>0) {
						for(i=0;i<sra.length;i++){
							if (sra[i] != sr) {
								$(ts).jqGrid("setSelection",sra[i],false, null);
							}
						}
					}
					if (sr) {
						$(ts).jqGrid("setSelection",sr,false,null);
					}
					ts.grid.bDiv.scrollLeft = left;
					$(ts).unbind('.selectionPreserver', restoreSelection);
				};
				$(ts).bind('jqGridGridComplete.selectionPreserver', restoreSelection);				
			}
		}; //var grid;

		if(this.tagName.toUpperCase()!='TABLE') {
			alert("Element is not a table");
			return;
		}
		$(this).empty().attr("tabindex","1");


		this.p = p ;
		this.p.useProp = !!$.fn.prop;
		var i, dir;
		if(this.p.colNames.length === 0) {
			for (i=0;i<this.p.colModel.length;i++){
				this.p.colNames[i] = this.p.colModel[i].label || this.p.colModel[i].name;
			}
		}
		if( this.p.colNames.length !== this.p.colModel.length ) {
			alert($.jgrid.errors.model);
			return;
		}
		var gv = $("<div class='ui-jqgrid-view'></div>"), ii,
		isMSIE = $.browser.msie ? true:false,
		isSafari = $.browser.webkit || $.browser.safari ? true : false;
		ts.p.direction = $.trim(ts.p.direction.toLowerCase());
		if($.inArray(ts.p.direction,["ltr","rtl"]) == -1) { ts.p.direction = "ltr"; }
		dir = ts.p.direction;

		$(gv).insertBefore(this);
		$(this).appendTo(gv).removeClass("scroll");
		var eg = $("<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'></div>");
		$(eg).insertBefore(gv).attr({"id" : "gbox_"+this.id,"dir":dir});
		$(gv).appendTo(eg).attr("id","gview_"+this.id);
		if (isMSIE && $.browser.version <= 6) {
			ii = '<iframe style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');" src="javascript:false;"></iframe>';
		} else { ii="";}
		$("<div class='ui-widget-overlay jqgrid-overlay' id='lui_"+this.id+"'></div>").append(ii).insertBefore(gv);
		$("<div class='loading ui-state-default ui-state-active' id='load_"+this.id+"'>"+this.p.loadtext+"</div>").insertBefore(gv);
		$(this).attr({cellspacing:"0",cellpadding:"0",border:"0","role":"grid","aria-multiselectable":!!this.p.multiselect,"aria-labelledby":"gbox_"+this.id});
		var sortkeys = ["shiftKey","altKey","ctrlKey"],
		intNum = function(val,defval) {
			val = parseInt(val,10);
			if (isNaN(val)) { return defval ? defval : 0;}
			else {return val;}
		},
		formatCol = function (pos, rowInd, tv, rawObject, rowId, rdata){
			var cm = ts.p.colModel[pos],
			ral = cm.align, result="style=\"", clas = cm.classes, nm = cm.name, celp, acp=[];
			if(ral) { result += "text-align:"+ral+";"; }
			if(cm.hidden===true) { result += "display:none;"; }
			if(rowInd===0) {
				result += "width: "+grid.headers[pos].width+"px;";
			} else if (cm.cellattr && $.isFunction(cm.cellattr))
			{
				celp = cm.cellattr.call(ts, rowId, tv, rawObject, cm, rdata);
				if(celp && typeof(celp) === "string") {
					celp = celp.replace(/style/i,'style').replace(/title/i,'title');
					if(celp.indexOf('title') > -1) { cm.title=false;}
					if(celp.indexOf('class') > -1) { clas = undefined;}
					acp = celp.split("style");
					if(acp.length === 2 ) {
						acp[1] =  $.trim(acp[1].replace("=",""));
						if(acp[1].indexOf("'") === 0 || acp[1].indexOf('"') === 0) {
							acp[1] = acp[1].substring(1);
						}
						result += acp[1].replace(/'/gi,'"');
					} else {
						result += "\"";
					}
				}
			}
			if(!acp.length) { acp[0] = ""; result += "\"";}
			result += (clas !== undefined ? (" class=\""+clas+"\"") :"") + ((cm.title && tv) ? (" title=\""+$.jgrid.stripHtml(tv)+"\"") :"");
			result += " aria-describedby=\""+ts.p.id+"_"+nm+"\"";
			return result + acp[0];
		},
		cellVal =  function (val) {
			return val === undefined || val === null || val === "" ? "&#160;" : (ts.p.autoencode ? $.jgrid.htmlEncode(val) : val+"");
		},
		formatter = function (rowId, cellval , colpos, rwdat, _act){
			var cm = ts.p.colModel[colpos],v;
			if(typeof cm.formatter !== 'undefined') {
				var opts= {rowId: rowId, colModel:cm, gid:ts.p.id, pos:colpos };
				if($.isFunction( cm.formatter ) ) {
					v = cm.formatter.call(ts,cellval,opts,rwdat,_act);
				} else if($.fmatter){
					v = $.fn.fmatter.call(ts,cm.formatter,cellval,opts,rwdat,_act);
				} else {
					v = cellVal(cellval);
				}
			} else {
				v = cellVal(cellval);
			}
			return v;
		},
		addCell = function(rowId,cell,pos,irow, srvr) {
			var v,prp;
			v = formatter(rowId,cell,pos,srvr,'add');
			prp = formatCol( pos,irow, v, srvr, rowId, true);
			return "<td role=\"gridcell\" "+prp+">"+v+"</td>";
		},
		addMulti = function(rowid,pos,irow){
			var	v = "<input role=\"checkbox\" type=\"checkbox\""+" id=\"jqg_"+ts.p.id+"_"+rowid+"\" class=\"cbox\" name=\"jqg_"+ts.p.id+"_"+rowid+"\"/>",
			prp = formatCol( pos,irow,'',null, rowid, true);
			return "<td role=\"gridcell\" "+prp+">"+v+"</td>";
		},
		addRowNum = function (pos,irow,pG,rN) {
			var v =  (parseInt(pG,10)-1)*parseInt(rN,10)+1+irow,
			prp = formatCol( pos,irow,v, null, irow, true);
			return "<td role=\"gridcell\" class=\"ui-state-default jqgrid-rownum\" "+prp+">"+v+"</td>";
		},
		reader = function (datatype) {
			var field, f=[], j=0, i;
			for(i =0; i<ts.p.colModel.length; i++){
				field = ts.p.colModel[i];
				if (field.name !== 'cb' && field.name !=='subgrid' && field.name !=='rn') {
					f[j]= datatype == "local" ?
					field.name :
					( (datatype=="xml" || datatype === "xmlstring") ? field.xmlmap || field.name : field.jsonmap || field.name );
					j++;
				}
			}
			return f;
		},
		orderedCols = function (offset) {
			var order = ts.p.remapColumns;
			if (!order || !order.length) {
				order = $.map(ts.p.colModel, function(v,i) { return i; });
			}
			if (offset) {
				order = $.map(order, function(v) { return v<offset?null:v-offset; });
			}
			return order;
		},
		emptyRows = function (parent, scroll, locdata) {
			if(ts.p.deepempty) {$("#"+$.jgrid.jqID(ts.p.id)+" tbody:first tr:gt(0)").remove();}
			else {
				var trf = $("#"+$.jgrid.jqID(ts.p.id)+" tbody:first tr:first")[0];
				$("#"+$.jgrid.jqID(ts.p.id)+" tbody:first").empty().append(trf);
			}
			if (scroll && ts.p.scroll) {
				$(">div:first", parent).css({height:"auto"}).children("div:first").css({height:0,display:"none"});
				parent.scrollTop = 0;
			}
			if(locdata === true) {
				if(ts.p.treeGrid === true ) {
				ts.p.data = []; ts.p._index = {};
			}
			}
		},
		refreshIndex = function() {
			var datalen = ts.p.data.length, idname, i, val,
			ni = ts.p.rownumbers===true ? 1 :0,
			gi = ts.p.multiselect ===true ? 1 :0,
			si = ts.p.subGrid===true ? 1 :0;

			if(ts.p.keyIndex === false || ts.p.loadonce === true) {
				idname = ts.p.localReader.id;
			} else {
				idname = ts.p.colModel[ts.p.keyIndex+gi+si+ni].name;
			}
			for(i =0;i < datalen; i++) {
				val = $.jgrid.getAccessor(ts.p.data[i],idname);
				ts.p._index[val] = i;
			}
		},
		constructTr = function(id, hide, altClass, rd, cur) {
			var tabindex = '-1', restAttr = '', attrName, style = hide ? 'display:none;' : '',
				classes = 'ui-widget-content jqgrow ui-row-' + ts.p.direction + altClass,
				rowAttrObj = $.isFunction(ts.p.rowattr) ? ts.p.rowattr.call(ts, rd, cur) : {};
			if(!$.isEmptyObject( rowAttrObj )) {
				if (rowAttrObj.hasOwnProperty("id")) {
					id = rowAttrObj.id;
					delete rowAttrObj.id;
				}
				if (rowAttrObj.hasOwnProperty("tabindex")) {
					tabindex = rowAttrObj.tabindex;
					delete rowAttrObj.tabindex;
				}
				if (rowAttrObj.hasOwnProperty("style")) {
					style += rowAttrObj.style;
					delete rowAttrObj.style;
				}
				if (rowAttrObj.hasOwnProperty("class")) {
					classes += ' ' + rowAttrObj['class'];
					delete rowAttrObj['class'];
				}
				// dot't allow to change role attribute
				try { delete rowAttrObj.role; } catch(ra){}
				for (attrName in rowAttrObj) {
					if (rowAttrObj.hasOwnProperty(attrName)) {
						restAttr += ' ' + attrName + '=' + rowAttrObj[attrName];
					}
				}
			}
			return '<tr role="row" id="' + id + '" tabindex="' + tabindex + '" class="' + classes + '"' +
				(style === '' ? '' : ' style="' + style + '"') + restAttr + '>';
		},
		addXmlData = function (xml,t, rcnt, more, adjust) {
			var startReq = new Date(),
			locdata = (ts.p.datatype != "local" && ts.p.loadonce) || ts.p.datatype == "xmlstring",
			xmlid = "_id_", xmlRd = ts.p.xmlReader,
			frd = ts.p.datatype == "local" ? "local" : "xml";
			if(locdata) {
				ts.p.data = [];
				ts.p._index = {};
				ts.p.localReader.id = xmlid;
			}
			ts.p.reccount = 0;
			if($.isXMLDoc(xml)) {
				if(ts.p.treeANode===-1 && !ts.p.scroll) {
					emptyRows(t,false, true);
					rcnt=1;
				} else { rcnt = rcnt > 1 ? rcnt :1; }
			} else { return; }
			var i,fpos,ir=0,v,gi=ts.p.multiselect===true?1:0,si=ts.p.subGrid===true?1:0,ni=ts.p.rownumbers===true?1:0,idn, getId,f=[],F,rd ={}, xmlr,rid, rowData=[], cn=(ts.p.altRows === true) ? " "+ts.p.altclass:"",cn1;
			if(!xmlRd.repeatitems) {f = reader(frd);}
			if( ts.p.keyIndex===false) {
				idn = $.isFunction( xmlRd.id ) ?  xmlRd.id.call(ts, xml) : xmlRd.id;
			} else {
				idn = ts.p.keyIndex;
			}
			if(f.length>0 && !isNaN(idn)) {
				if (ts.p.remapColumns && ts.p.remapColumns.length) {
					idn = $.inArray(idn, ts.p.remapColumns);
				}
				idn=f[idn];
			}
			if( (idn+"").indexOf("[") === -1 ) {
				if (f.length) {
					getId = function( trow, k) {return $(idn,trow).text() || k;};
				} else {
					getId = function( trow, k) {return $(xmlRd.cell,trow).eq(idn).text() || k;};
				}
			}
			else {
				getId = function( trow, k) {return trow.getAttribute(idn.replace(/[\[\]]/g,"")) || k;};
			}
			ts.p.userData = {};
			ts.p.page = $.jgrid.getXmlData( xml,xmlRd.page ) || 0;
			ts.p.lastpage = $.jgrid.getXmlData( xml,xmlRd.total );
			if(ts.p.lastpage===undefined) { ts.p.lastpage=1; }
			ts.p.records = $.jgrid.getXmlData( xml,xmlRd.records ) || 0;
			if($.isFunction(xmlRd.userdata)) {
				ts.p.userData = xmlRd.userdata.call(ts, xml) || {};
			} else {
				$.jgrid.getXmlData(xml, xmlRd.userdata, true).each(function() {ts.p.userData[this.getAttribute("name")]= $(this).text();});
			}
			var gxml = $.jgrid.getXmlData( xml, xmlRd.root, true);
			gxml = $.jgrid.getXmlData( gxml, xmlRd.row, true);
			if (!gxml) { gxml = []; }
			var gl = gxml.length, j=0, grpdata={}, rn = parseInt(ts.p.rowNum,10);
			if (gl > 0 &&  ts.p.page <= 0) { ts.p.page = 1; }
			if(gxml && gl){
			var br=ts.p.scroll?$.jgrid.randId():1,altr;
			if (adjust) { rn *= adjust+1; }
			var afterInsRow = $.isFunction(ts.p.afterInsertRow), hiderow=ts.p.grouping && ts.p.groupingView.groupCollapse === true;
			while (j<gl) {
				xmlr = gxml[j];
				rid = getId(xmlr,br+j);
				rid  = ts.p.idPrefix + rid;
				altr = rcnt === 0 ? 0 : rcnt+1;
				cn1 = (altr+j)%2 == 1 ? cn : '';
				var iStartTrTag = rowData.length;
				rowData.push("");
				if( ni ) {
					rowData.push( addRowNum(0,j,ts.p.page,ts.p.rowNum) );
				}
				if( gi ) {
					rowData.push( addMulti(rid,ni,j) );
				}
				if( si ) {
					rowData.push( $(ts).jqGrid("addSubGridCell",gi+ni,j+rcnt) );
				}
				if(xmlRd.repeatitems){
					if (!F) { F=orderedCols(gi+si+ni); }
					var cells = $.jgrid.getXmlData( xmlr, xmlRd.cell, true);
					$.each(F, function (k) {
						var cell = cells[this];
						if (!cell) { return false; }
						v = cell.textContent || cell.text;
						rd[ts.p.colModel[k+gi+si+ni].name] = v;
						rowData.push( addCell(rid,v,k+gi+si+ni,j+rcnt,xmlr) );
					});
				} else {
					for(i = 0; i < f.length;i++) {
						v = $.jgrid.getXmlData( xmlr, f[i]);
						rd[ts.p.colModel[i+gi+si+ni].name] = v;
						rowData.push( addCell(rid, v, i+gi+si+ni, j+rcnt, xmlr) );
					}
				}
				rowData[iStartTrTag] = constructTr(rid, hiderow, cn1, rd, xmlr);
				rowData.push("</tr>");
				if(ts.p.grouping) {
					var grlen = ts.p.groupingView.groupField.length, grpitem = [];
					for(var z=0;z<grlen;z++) {
						grpitem.push(rd[ts.p.groupingView.groupField[z]]);
					}
					grpdata = $(ts).jqGrid('groupingPrepare',rowData, grpitem, grpdata, rd);
					rowData = [];
				}
				if(locdata || ts.p.treeGrid === true) {
					rd[xmlid] = rid;
					ts.p.data.push(rd);
					ts.p._index[rid] = ts.p.data.length-1;
				}
				if(ts.p.gridview === false ) {
					$("tbody:first",t).append(rowData.join(''));
					$(ts).triggerHandler("jqGridAfterInsertRow", [rid, rd, xmlr]);
					if(afterInsRow) {ts.p.afterInsertRow.call(ts,rid,rd,xmlr);}
					rowData=[];
				}
				rd={};
				ir++;
				j++;
				if(ir==rn) {break;}
			}
			}
			if(ts.p.gridview === true) {
				fpos = ts.p.treeANode > -1 ? ts.p.treeANode: 0;
				if(ts.p.grouping) {
					$(ts).jqGrid('groupingRender',grpdata,ts.p.colModel.length);
					grpdata = null;
				} else if(ts.p.treeGrid === true && fpos > 0) {
					$(ts.rows[fpos]).after(rowData.join(''));
				} else {
					$("tbody:first",t).append(rowData.join(''));
				}
			}
			if(ts.p.subGrid === true ) {
				try {$(ts).jqGrid("addSubGrid",gi+ni);} catch (_){}
			}
			ts.p.totaltime = new Date() - startReq;
			if(ir>0) { if(ts.p.records===0) { ts.p.records=gl;} }
			rowData =null;
			if( ts.p.treeGrid === true) {
				try {$(ts).jqGrid("setTreeNode", fpos+1, ir+fpos+1);} catch (e) {}
			}
			if(!ts.p.treeGrid && !ts.p.scroll) {ts.grid.bDiv.scrollTop = 0;}
			ts.p.reccount=ir;
			ts.p.treeANode = -1;
			if(ts.p.userDataOnFooter) { $(ts).jqGrid("footerData","set",ts.p.userData,true); }
			if(locdata) {
				ts.p.records = gl;
				ts.p.lastpage = Math.ceil(gl/ rn);
			}
			if (!more) { ts.updatepager(false,true); }
			if(locdata) {
				while (ir<gl) {
					xmlr = gxml[ir];
					rid = getId(xmlr,ir+br);
					rid  = ts.p.idPrefix + rid;
					if(xmlRd.repeatitems){
						if (!F) { F=orderedCols(gi+si+ni); }
						var cells2 = $.jgrid.getXmlData( xmlr, xmlRd.cell, true);
						$.each(F, function (k) {
							var cell = cells2[this];
							if (!cell) { return false; }
							v = cell.textContent || cell.text;
							rd[ts.p.colModel[k+gi+si+ni].name] = v;
						});
					} else {
						for(i = 0; i < f.length;i++) {
							v = $.jgrid.getXmlData( xmlr, f[i]);
							rd[ts.p.colModel[i+gi+si+ni].name] = v;
						}
					}
					rd[xmlid] = rid;
					ts.p.data.push(rd);
					ts.p._index[rid] = ts.p.data.length-1;
					rd = {};
					ir++;
				}
			}
		},
		addJSONData = function(data,t, rcnt, more, adjust) {
			var startReq = new Date();
			if(data) {
				if(ts.p.treeANode === -1 && !ts.p.scroll) {
					emptyRows(t,false, true);
					rcnt=1;
				} else { rcnt = rcnt > 1 ? rcnt :1; }
			} else { return; }

			var dReader, locid = "_id_", frd,
			locdata = (ts.p.datatype != "local" && ts.p.loadonce) || ts.p.datatype == "jsonstring";
			if(locdata) { ts.p.data = []; ts.p._index = {}; ts.p.localReader.id = locid;}
			ts.p.reccount = 0;
			if(ts.p.datatype == "local") {
				dReader =  ts.p.localReader;
				frd= 'local';
			} else {
				dReader =  ts.p.jsonReader;
				frd='json';
			}
			var ir=0,v,i,j,f=[],F,cur,gi=ts.p.multiselect?1:0,si=ts.p.subGrid?1:0,ni=ts.p.rownumbers===true?1:0,len,drows,idn,rd={}, fpos, idr,rowData=[],cn=(ts.p.altRows === true) ? " "+ts.p.altclass:"",cn1,lp;
			ts.p.page = $.jgrid.getAccessor(data,dReader.page) || 0;
			lp = $.jgrid.getAccessor(data,dReader.total);
			ts.p.lastpage = lp === undefined ? 1 : lp;
			ts.p.records = $.jgrid.getAccessor(data,dReader.records) || 0;
			ts.p.userData = $.jgrid.getAccessor(data,dReader.userdata) || {};
			if(!dReader.repeatitems) {
				F = f = reader(frd);
			}
			if( ts.p.keyIndex===false ) {
				idn = $.isFunction(dReader.id) ? dReader.id.call(ts, data) : dReader.id; 
			} else {
				idn = ts.p.keyIndex;
			}
			if(f.length>0 && !isNaN(idn)) {
				if (ts.p.remapColumns && ts.p.remapColumns.length) {
					idn = $.inArray(idn, ts.p.remapColumns);
				}
				idn=f[idn];
			}
			drows = $.jgrid.getAccessor(data,dReader.root);
			if (!drows) { drows = []; }
			len = drows.length; i=0;
			if (len > 0 && ts.p.page <= 0) { ts.p.page = 1; }
			var rn = parseInt(ts.p.rowNum,10),br=ts.p.scroll?$.jgrid.randId():1, altr;
			if (adjust) { rn *= adjust+1; }
			var afterInsRow = $.isFunction(ts.p.afterInsertRow), grpdata={}, hiderow=ts.p.grouping && ts.p.groupingView.groupCollapse === true;
			while (i<len) {
				cur = drows[i];
				idr = $.jgrid.getAccessor(cur,idn);
				if(idr === undefined) {
					idr = br+i;
					if(f.length===0){
						if(dReader.cell){
							var ccur = $.jgrid.getAccessor(cur,dReader.cell);
							idr = ccur !== undefined ? ccur[idn] || idr : idr;
							ccur=null;
						}
					}
				}
				idr  = ts.p.idPrefix + idr;
				altr = rcnt === 1 ? 0 : rcnt;
				cn1 = (altr+i)%2 == 1 ? cn : '';
				var iStartTrTag = rowData.length;
				rowData.push("");
				if( ni ) {
					rowData.push( addRowNum(0,i,ts.p.page,ts.p.rowNum) );
				}
				if( gi ){
					rowData.push( addMulti(idr,ni,i) );
				}
				if( si ) {
					rowData.push( $(ts).jqGrid("addSubGridCell",gi+ni,i+rcnt) );
				}
				if (dReader.repeatitems) {
					if(dReader.cell) {cur = $.jgrid.getAccessor(cur,dReader.cell);}
					if (!F) { F=orderedCols(gi+si+ni); }
				}
				for (j=0;j<F.length;j++) {
					v = $.jgrid.getAccessor(cur,F[j]);
					rowData.push( addCell(idr,v,j+gi+si+ni,i+rcnt,cur) );
					rd[ts.p.colModel[j+gi+si+ni].name] = v;
				}
				rowData[iStartTrTag] = constructTr(idr, hiderow, cn1, rd, cur);
				rowData.push( "</tr>" );
				if(ts.p.grouping) {
					var grlen = ts.p.groupingView.groupField.length, grpitem = [];
					for(var z=0;z<grlen;z++) {
						grpitem.push(rd[ts.p.groupingView.groupField[z]]);
					}
					grpdata = $(ts).jqGrid('groupingPrepare',rowData, grpitem, grpdata, rd);
					rowData = [];
				}
				if(locdata || ts.p.treeGrid===true) {
					rd[locid] = idr;
					ts.p.data.push(rd);
					ts.p._index[idr] = ts.p.data.length-1;
				}
				if(ts.p.gridview === false ) {
					$("#"+$.jgrid.jqID(ts.p.id)+" tbody:first").append(rowData.join(''));
					$(ts).triggerHandler("jqGridAfterInsertRow", [idr, rd, cur]);
					if(afterInsRow) {ts.p.afterInsertRow.call(ts,idr,rd,cur);}
					rowData=[];//ari=0;
				}
				rd={};
				ir++;
				i++;
				if(ir==rn) { break; }
			}
			if(ts.p.gridview === true ) {
				fpos = ts.p.treeANode > -1 ? ts.p.treeANode: 0;
				if(ts.p.grouping) {
					$(ts).jqGrid('groupingRender',grpdata,ts.p.colModel.length);
					grpdata = null;
				} else if(ts.p.treeGrid === true && fpos > 0) {
					$(ts.rows[fpos]).after(rowData.join(''));
				} else {
					$("#"+$.jgrid.jqID(ts.p.id)+" tbody:first").append(rowData.join(''));
				}
			}
			if(ts.p.subGrid === true ) {
				try { $(ts).jqGrid("addSubGrid",gi+ni);} catch (_){}
			}
			ts.p.totaltime = new Date() - startReq;
			if(ir>0) {
				if(ts.p.records===0) { ts.p.records=len; }
			}
			rowData = null;
			if( ts.p.treeGrid === true) {
				try {$(ts).jqGrid("setTreeNode", fpos+1, ir+fpos+1);} catch (e) {}
			}
			if(!ts.p.treeGrid && !ts.p.scroll) {ts.grid.bDiv.scrollTop = 0;}
			ts.p.reccount=ir;
			ts.p.treeANode = -1;
			if(ts.p.userDataOnFooter) { $(ts).jqGrid("footerData","set",ts.p.userData,true); }
			if(locdata) {
				ts.p.records = len;
				ts.p.lastpage = Math.ceil(len/ rn);
			}
			if (!more) { ts.updatepager(false,true); }
			if(locdata) {
				while (ir<len && drows[ir]) {
					cur = drows[ir];
					idr = $.jgrid.getAccessor(cur,idn);
					if(idr === undefined) {
						idr = br+ir;
						if(f.length===0){
							if(dReader.cell){
								var ccur2 = $.jgrid.getAccessor(cur,dReader.cell);
								idr = ccur2[idn] || idr;
								ccur2=null;
							}
						}
					}
					if(cur) {
						idr  = ts.p.idPrefix + idr;
						if (dReader.repeatitems) {
							if(dReader.cell) {cur = $.jgrid.getAccessor(cur,dReader.cell);}
							if (!F) { F=orderedCols(gi+si+ni); }
						}

						for (j=0;j<F.length;j++) {
							v = $.jgrid.getAccessor(cur,F[j]);
							rd[ts.p.colModel[j+gi+si+ni].name] = v;
						}
						rd[locid] = idr;
						ts.p.data.push(rd);
						ts.p._index[idr] = ts.p.data.length-1;
						rd = {};
					}
					ir++;
				}
			}
		},
		addLocalData = function() {
			var st, fndsort=false, cmtypes={}, grtypes=[], grindexes=[], srcformat, sorttype, newformat;
			if(!$.isArray(ts.p.data)) {
				return;
			}
			var grpview = ts.p.grouping ? ts.p.groupingView : false;
			$.each(ts.p.colModel,function(){
				sorttype = this.sorttype || "text";
				if(sorttype == "date" || sorttype == "datetime") {
					if(this.formatter && typeof(this.formatter) === 'string' && this.formatter == 'date') {
						if(this.formatoptions && this.formatoptions.srcformat) {
							srcformat = this.formatoptions.srcformat;
						} else {
							srcformat = $.jgrid.formatter.date.srcformat;
						}
						if(this.formatoptions && this.formatoptions.newformat) {
							newformat = this.formatoptions.newformat;
						} else {
							newformat = $.jgrid.formatter.date.newformat;
						}
					} else {
						srcformat = newformat = this.datefmt || "Y-m-d";
					}
					cmtypes[this.name] = {"stype": sorttype, "srcfmt": srcformat,"newfmt":newformat};
				} else {
					cmtypes[this.name] = {"stype": sorttype, "srcfmt":'',"newfmt":''};
				}
				if(ts.p.grouping && this.name == grpview.groupField[0]) {
					var grindex = this.name;
					if (typeof this.index != 'undefined') {
						grindex = this.index;
					}
					grtypes[0] = cmtypes[grindex];
					grindexes.push(grindex);
				}
				if(!fndsort && (this.index == ts.p.sortname || this.name == ts.p.sortname)){
					st = this.name; // ???
					fndsort = true;
				}
			});
			if(ts.p.treeGrid) {
				$(ts).jqGrid("SortTree", st, ts.p.sortorder, cmtypes[st].stype, cmtypes[st].srcfmt);
				return;
			}
			var compareFnMap = {
				'eq':function(queryObj) {return queryObj.equals;},
				'ne':function(queryObj) {return queryObj.notEquals;},
				'lt':function(queryObj) {return queryObj.less;},
				'le':function(queryObj) {return queryObj.lessOrEquals;},
				'gt':function(queryObj) {return queryObj.greater;},
				'ge':function(queryObj) {return queryObj.greaterOrEquals;},
				'cn':function(queryObj) {return queryObj.contains;},
				'nc':function(queryObj,op) {return op === "OR" ? queryObj.orNot().contains : queryObj.andNot().contains;},
				'bw':function(queryObj) {return queryObj.startsWith;},
				'bn':function(queryObj,op) {return op === "OR" ? queryObj.orNot().startsWith : queryObj.andNot().startsWith;},
				'en':function(queryObj,op) {return op === "OR" ? queryObj.orNot().endsWith : queryObj.andNot().endsWith;},
				'ew':function(queryObj) {return queryObj.endsWith;},
				'ni':function(queryObj,op) {return op === "OR" ? queryObj.orNot().equals : queryObj.andNot().equals;},
				'in':function(queryObj) {return queryObj.equals;},
				'nu':function(queryObj) {return queryObj.isNull;},
				'nn':function(queryObj,op) {return op === "OR" ? queryObj.orNot().isNull : queryObj.andNot().isNull;}

			},
			query = jlinq.from(ts.p.data);
			if (ts.p.ignoreCase) { query = query.ignoreCase(); }
			function tojLinq ( group ) {
				var s = 0, index, gor, ror, opr, rule;
				if (group.groups !== undefined) {
					gor = group.groups.length && group.groupOp.toString().toUpperCase() === "OR";
					if (gor) {
						query.orBegin();
					}
					for (index = 0; index < group.groups.length; index++) {
						if (s > 0 && gor) {
							query.or();
						}
						try {
							tojLinq(group.groups[index]);
						} catch (e) {alert(e);}
						s++;
					}
					if (gor) {
						query.orEnd();
					}
				}
				if (group.rules !== undefined) {
					if(s>0) {
						var result = query.select();
						query = jlinq.from( result);
						if (ts.p.ignoreCase) { query = query.ignoreCase(); } 
					}
					try{
						ror = group.rules.length && group.groupOp.toString().toUpperCase() === "OR";
						if (ror) {
							query.orBegin();
						}
						for (index = 0; index < group.rules.length; index++) {
							rule = group.rules[index];
							opr = group.groupOp.toString().toUpperCase();
							if (compareFnMap[rule.op] && rule.field ) {
								if(s > 0 && opr && opr === "OR") {
									query = query.or();
								}
								query = compareFnMap[rule.op](query, opr)(rule.field, rule.data, cmtypes[rule.field]);
							}
							s++;
						}
						if (ror) {
							query.orEnd();
						}
					} catch (g) {alert(g);}
				}
			}

			if (ts.p.search === true) {
				var srules = ts.p.postData.filters;
				if(srules) {
					if(typeof srules == "string") { srules = $.jgrid.parse(srules);}
					tojLinq( srules );
				} else {
					try {
						query = compareFnMap[ts.p.postData.searchOper](query)(ts.p.postData.searchField, ts.p.postData.searchString,cmtypes[ts.p.postData.searchField]);
					} catch (se){}
				}
			}
			if(ts.p.grouping) {
				query.orderBy(grindexes,grpview.groupOrder[0],grtypes[0].stype, grtypes[0].srcfmt);
				grpview.groupDataSorted = true;
			}
			if (st && ts.p.sortorder && fndsort) {
				if(ts.p.sortorder.toUpperCase() == "DESC") {
					query.orderBy(ts.p.sortname, "d", cmtypes[st].stype, cmtypes[st].srcfmt);
				} else {
					query.orderBy(ts.p.sortname, "a", cmtypes[st].stype, cmtypes[st].srcfmt);
				}
			}
			var queryResults = query.select(),
			recordsperpage = parseInt(ts.p.rowNum,10),
			total = queryResults.length,
			page = parseInt(ts.p.page,10),
			totalpages = Math.ceil(total / recordsperpage),
			retresult = {};
			queryResults = queryResults.slice( (page-1)*recordsperpage , page*recordsperpage );
			query = null;
			cmtypes = null;
			retresult[ts.p.localReader.total] = totalpages;
			retresult[ts.p.localReader.page] = page;
			retresult[ts.p.localReader.records] = total;
			retresult[ts.p.localReader.root] = queryResults;
			retresult[ts.p.localReader.userdata] = ts.p.userData;
			queryResults = null;
			return  retresult;
		},
		updatepager = function(rn, dnd) {
			var cp, last, base, from,to,tot,fmt, pgboxes = "", sppg,
			tspg = ts.p.pager ? "_"+$.jgrid.jqID(ts.p.pager.substr(1)) : "",
			tspg_t = ts.p.toppager ? "_"+ts.p.toppager.substr(1) : "";
			base = parseInt(ts.p.page,10)-1;
			if(base < 0) { base = 0; }
			base = base*parseInt(ts.p.rowNum,10);
			to = base + ts.p.reccount;
			if (ts.p.scroll) {
				var rows = $("tbody:first > tr:gt(0)", ts.grid.bDiv);
				base = to - rows.length;
				ts.p.reccount = rows.length;
				var rh = rows.outerHeight() || ts.grid.prevRowHeight;
				if (rh) {
					var top = base * rh;
					var height = parseInt(ts.p.records,10) * rh;
					$(">div:first",ts.grid.bDiv).css({height : height}).children("div:first").css({height:top,display:top?"":"none"});
				}
				ts.grid.bDiv.scrollLeft = ts.grid.hDiv.scrollLeft;
			}
			pgboxes = ts.p.pager ? ts.p.pager : "";
			pgboxes += ts.p.toppager ?  (pgboxes ? "," + ts.p.toppager : ts.p.toppager) : "";
			if(pgboxes) {
				fmt = $.jgrid.formatter.integer || {};
				cp = intNum(ts.p.page);
				last = intNum(ts.p.lastpage);
				$(".selbox",pgboxes)[ this.p.useProp ? 'prop' : 'attr' ]("disabled",false);
				if(ts.p.pginput===true) {
					$('.ui-pg-input',pgboxes).val(ts.p.page);
					sppg = ts.p.toppager ? '#sp_1'+tspg+",#sp_1"+tspg_t : '#sp_1'+tspg;
					$(sppg).html($.fmatter ? $.fmatter.util.NumberFormat(ts.p.lastpage,fmt):ts.p.lastpage);

				}
				if (ts.p.viewrecords){
					if(ts.p.reccount === 0) {
						$(".ui-paging-info",pgboxes).html(ts.p.emptyrecords);
					} else {
						from = base+1;
						tot=ts.p.records;
						if($.fmatter) {
							from = $.fmatter.util.NumberFormat(from,fmt);
							to = $.fmatter.util.NumberFormat(to,fmt);
							tot = $.fmatter.util.NumberFormat(tot,fmt);
						}
						$(".ui-paging-info",pgboxes).html($.jgrid.format(ts.p.recordtext,from,to,tot));
					}
				}
				if(ts.p.pgbuttons===true) {
					if(cp<=0) {cp = last = 0;}
					if(cp==1 || cp === 0) {
						$("#first"+tspg+", #prev"+tspg).addClass('ui-state-disabled').removeClass('ui-state-hover');
						if(ts.p.toppager) { $("#first_t"+tspg_t+", #prev_t"+tspg_t).addClass('ui-state-disabled').removeClass('ui-state-hover'); }
					} else {
						$("#first"+tspg+", #prev"+tspg).removeClass('ui-state-disabled');
						if(ts.p.toppager) { $("#first_t"+tspg_t+", #prev_t"+tspg_t).removeClass('ui-state-disabled'); }
					}
					if(cp==last || cp === 0) {
						$("#next"+tspg+", #last"+tspg).addClass('ui-state-disabled').removeClass('ui-state-hover');
						if(ts.p.toppager) { $("#next_t"+tspg_t+", #last_t"+tspg_t).addClass('ui-state-disabled').removeClass('ui-state-hover'); }
					} else {
						$("#next"+tspg+", #last"+tspg).removeClass('ui-state-disabled');
						if(ts.p.toppager) { $("#next_t"+tspg_t+", #last_t"+tspg_t).removeClass('ui-state-disabled'); }
					}
				}
			}
			if(rn===true && ts.p.rownumbers === true) {
				$("td.jqgrid-rownum",ts.rows).each(function(i){
					$(this).html(base+1+i);
				});
			}
			if(dnd && ts.p.jqgdnd) { $(ts).jqGrid('gridDnD','updateDnD');}
			$(ts).triggerHandler("jqGridGridComplete");
			if($.isFunction(ts.p.gridComplete)) {ts.p.gridComplete.call(ts);}
			$(ts).triggerHandler("jqGridAfterGridComplete");
		},
		beginReq = function() {
			ts.grid.hDiv.loading = true;
			if(ts.p.hiddengrid) { return;}
			switch(ts.p.loadui) {
				case "disable":
					break;
				case "enable":
					$("#load_"+$.jgrid.jqID(ts.p.id)).show();
					break;
				case "block":
					$("#lui_"+$.jgrid.jqID(ts.p.id)).show();
					$("#load_"+$.jgrid.jqID(ts.p.id)).show();
					break;
			}
		},
		endReq = function() {
			ts.grid.hDiv.loading = false;
			switch(ts.p.loadui) {
				case "disable":
					break;
				case "enable":
					$("#load_"+$.jgrid.jqID(ts.p.id)).hide();
					break;
				case "block":
					$("#lui_"+$.jgrid.jqID(ts.p.id)).hide();
					$("#load_"+$.jgrid.jqID(ts.p.id)).hide();
					break;
			}
		},
		populate = function (npage) {
			if(!ts.grid.hDiv.loading) {
				var pvis = ts.p.scroll && npage === false,
				prm = {}, dt, dstr, pN=ts.p.prmNames;
				if(ts.p.page <=0) { ts.p.page = 1; }
				if(pN.search !== null) {prm[pN.search] = ts.p.search;} if(pN.nd !== null) {prm[pN.nd] = new Date().getTime();}
				if(pN.rows !== null) {prm[pN.rows]= ts.p.rowNum;} if(pN.page !== null) {prm[pN.page]= ts.p.page;}
				if(pN.sort !== null) {prm[pN.sort]= ts.p.sortname;} if(pN.order !== null) {prm[pN.order]= ts.p.sortorder;}
				if(ts.p.rowTotal !== null && pN.totalrows !== null) { prm[pN.totalrows]= ts.p.rowTotal; }
				var lcf = $.isFunction(ts.p.loadComplete), lc = lcf ? ts.p.loadComplete : null;
				var adjust = 0;
				npage = npage || 1;
				if (npage > 1) {
					if(pN.npage !== null) {
						prm[pN.npage] = npage;
						adjust = npage - 1;
						npage = 1;
					} else {
						lc = function(req) {
							ts.p.page++;
							ts.grid.hDiv.loading = false;
							if (lcf) {
								ts.p.loadComplete.call(ts,req);
							}
							populate(npage-1);
						};
					}
				} else if (pN.npage !== null) {
					delete ts.p.postData[pN.npage];
				}
				if(ts.p.grouping) {
					$(ts).jqGrid('groupingSetup');
					if(ts.p.groupingView.groupDataSorted === true) {
						prm[pN.sort] = ts.p.groupingView.groupField[0] +" "+ ts.p.groupingView.groupOrder[0]+", "+prm[pN.sort];
					}
				}
				$.extend(ts.p.postData,prm);
				var rcnt = !ts.p.scroll ? 1 : ts.rows.length-1;
				var bfr = $(ts).triggerHandler("jqGridBeforeRequest");
				if (bfr === false || bfr === 'stop') { return; }
				if ($.isFunction(ts.p.datatype)) { ts.p.datatype.call(ts,ts.p.postData,"load_"+ts.p.id); return;}
				else if($.isFunction(ts.p.beforeRequest)) {
					bfr = ts.p.beforeRequest.call(ts);
					if(bfr === undefined) { bfr = true; }
					if ( bfr === false ) { return; }
				}
				dt = ts.p.datatype.toLowerCase();
				switch(dt)
				{
				case "json":
				case "jsonp":
				case "xml":
				case "script":
					$.ajax($.extend({
						url:ts.p.url,
						type:ts.p.mtype,
						dataType: dt ,
						data: $.isFunction(ts.p.serializeGridData)? ts.p.serializeGridData.call(ts,ts.p.postData) : ts.p.postData,
						success:function(data,st, xhr) {
							if ($.isFunction(ts.p.beforeProcessing)) {
									ts.p.beforeProcessing.call(ts, data, st, xhr);
							}
							if(dt === "xml") { addXmlData(data, ts.grid.bDiv, rcnt, npage>1, adjust); }
							else { addJSONData(data,ts.grid.bDiv,rcnt,npage>1,adjust); }
							$(ts).triggerHandler("jqGridLoadComplete", [data]);
							if(lc) { lc.call(ts,data); }
							$(ts).triggerHandler("jqGridAfterLoadComplete", [data]);
							if (pvis) { ts.grid.populateVisible(); }
							if( ts.p.loadonce || ts.p.treeGrid) {ts.p.datatype = "local";}
							data=null;
							if (npage === 1) { endReq(); }
						},
						error:function(xhr,st,err){
							if($.isFunction(ts.p.loadError)) { ts.p.loadError.call(ts,xhr,st,err); }
							if (npage === 1) { endReq(); }
							xhr=null;
						},
						beforeSend: function(xhr, settings ){
							var gotoreq = true;
							if($.isFunction(ts.p.loadBeforeSend)) {
								gotoreq = ts.p.loadBeforeSend.call(ts,xhr, settings); 
							}
							if(gotoreq === undefined) { gotoreq = true; }
							if(gotoreq === false) {
								return false;
							} else {
								beginReq();
							}
						}
					},$.jgrid.ajaxOptions, ts.p.ajaxGridOptions));
				break;
				case "xmlstring":
					beginReq();
					dstr = $.jgrid.stringToDoc(ts.p.datastr);
					addXmlData(dstr,ts.grid.bDiv);
					$(ts).triggerHandler("jqGridLoadComplete", [dstr]);
					if(lcf) {ts.p.loadComplete.call(ts,dstr);}
					$(ts).triggerHandler("jqGridAfterLoadComplete", [dstr]);
					ts.p.datatype = "local";
					ts.p.datastr = null;
					endReq();
				break;
				case "jsonstring":
					beginReq();
					if(typeof ts.p.datastr == 'string') { dstr = $.jgrid.parse(ts.p.datastr); }
					else { dstr = ts.p.datastr; }
					addJSONData(dstr,ts.grid.bDiv);
					$(ts).triggerHandler("jqGridLoadComplete", [dstr]);
					if(lcf) {ts.p.loadComplete.call(ts,dstr);}
					$(ts).triggerHandler("jqGridAfterLoadComplete", [dstr]);
					ts.p.datatype = "local";
					ts.p.datastr = null;
					endReq();
				break;
				case "local":
				case "clientside":
					beginReq();
					ts.p.datatype = "local";
					var req = addLocalData();
					addJSONData(req,ts.grid.bDiv,rcnt,npage>1,adjust);
					$(ts).triggerHandler("jqGridLoadComplete", [req]);
					if(lc) { lc.call(ts,req); }
					$(ts).triggerHandler("jqGridAfterLoadComplete", [req]);
					if (pvis) { ts.grid.populateVisible(); }
					endReq();
				break;
				}
			}
		},
		setHeadCheckBox = function ( checked ) {
			$('#cb_'+$.jgrid.jqID(ts.p.id),ts.grid.hDiv)[ts.p.useProp ? 'prop': 'attr']("checked", checked);
			var fid = ts.p.frozenColumns ? ts.p.id+"_frozen" : "";
			if(fid) {
				$('#cb_'+$.jgrid.jqID(ts.p.id),ts.grid.fhDiv)[ts.p.useProp ? 'prop': 'attr']("checked", checked);
			}
		},
		setPager = function (pgid, tp){
			// TBD - consider escaping pgid with pgid = $.jgrid.jqID(pgid);
			var sep = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>",
			pginp = "",
			pgl="<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>",
			str="", pgcnt, lft, cent, rgt, twd, tdw, i,
			clearVals = function(onpaging){
				var ret;
				if ($.isFunction(ts.p.onPaging) ) { ret = ts.p.onPaging.call(ts,onpaging); }
				ts.p.selrow = null;
				if(ts.p.multiselect) {ts.p.selarrrow =[]; setHeadCheckBox( false );}
				ts.p.savedRow = [];
				if(ret=='stop') {return false;}
				return true;
			};
			pgid = pgid.substr(1);
			tp += "_" + pgid;
			pgcnt = "pg_"+pgid;
			lft = pgid+"_left"; cent = pgid+"_center"; rgt = pgid+"_right";
			$("#"+$.jgrid.jqID(pgid) )
			.append("<div id='"+pgcnt+"' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='"+lft+"' align='left'></td><td id='"+cent+"' align='center' style='white-space:pre;'></td><td id='"+rgt+"' align='right'></td></tr></tbody></table></div>")
			.attr("dir","ltr"); //explicit setting
			if(ts.p.rowList.length >0){
				str = "<td dir='"+dir+"'>";
				str +="<select class='ui-pg-selbox' role='listbox'>";
				for(i=0;i<ts.p.rowList.length;i++){
					str +="<option role=\"option\" value=\""+ts.p.rowList[i]+"\""+((ts.p.rowNum == ts.p.rowList[i])?" selected=\"selected\"":"")+">"+ts.p.rowList[i]+"</option>";
				}
				str +="</select></td>";
			}
			if(dir=="rtl") { pgl += str; }
			if(ts.p.pginput===true) { pginp= "<td dir='"+dir+"'>"+$.jgrid.format(ts.p.pgtext || "","<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>","<span id='sp_1_"+$.jgrid.jqID(pgid)+"'></span>")+"</td>";}
			if(ts.p.pgbuttons===true) {
				var po=["first"+tp,"prev"+tp, "next"+tp,"last"+tp]; if(dir=="rtl") { po.reverse(); }
				pgl += "<td id='"+po[0]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-first'></span></td>";
				pgl += "<td id='"+po[1]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-prev'></span></td>";
				pgl += pginp !== "" ? sep+pginp+sep:"";
				pgl += "<td id='"+po[2]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-next'></span></td>";
				pgl += "<td id='"+po[3]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-end'></span></td>";
			} else if (pginp !== "") { pgl += pginp; }
			if(dir=="ltr") { pgl += str; }
			pgl += "</tr></tbody></table>";
			if(ts.p.viewrecords===true) {$("td#"+pgid+"_"+ts.p.recordpos,"#"+pgcnt).append("<div dir='"+dir+"' style='text-align:"+ts.p.recordpos+"' class='ui-paging-info'></div>");}
			$("td#"+pgid+"_"+ts.p.pagerpos,"#"+pgcnt).append(pgl);
			tdw = $(".ui-jqgrid").css("font-size") || "11px";
			$(document.body).append("<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:"+tdw+";visibility:hidden;' ></div>");
			twd = $(pgl).clone().appendTo("#testpg").width();
			$("#testpg").remove();
			if(twd > 0) {
				if(pginp !== "") { twd += 50; } //should be param
				$("td#"+pgid+"_"+ts.p.pagerpos,"#"+pgcnt).width(twd);
			}
			ts.p._nvtd = [];
			ts.p._nvtd[0] = twd ? Math.floor((ts.p.width - twd)/2) : Math.floor(ts.p.width/3);
			ts.p._nvtd[1] = 0;
			pgl=null;
			$('.ui-pg-selbox',"#"+pgcnt).bind('change',function() {
				ts.p.page = Math.round(ts.p.rowNum*(ts.p.page-1)/this.value-0.5)+1;
				ts.p.rowNum = this.value;
				if(ts.p.pager) { $('.ui-pg-selbox',ts.p.pager).val(this.value); }
				if(ts.p.toppager) { $('.ui-pg-selbox',ts.p.toppager).val(this.value); }
				if(!clearVals('records')) { return false; }
				populate();
				return false;
			});
			if(ts.p.pgbuttons===true) {
			$(".ui-pg-button","#"+pgcnt).hover(function(){
				if($(this).hasClass('ui-state-disabled')) {
					this.style.cursor='default';
				} else {
					$(this).addClass('ui-state-hover');
					this.style.cursor='pointer';
				}
			},function() {
				if(!$(this).hasClass('ui-state-disabled')) {
					$(this).removeClass('ui-state-hover');
					this.style.cursor= "default";
				}
			});
			$("#first"+$.jgrid.jqID(tp)+", #prev"+$.jgrid.jqID(tp)+", #next"+$.jgrid.jqID(tp)+", #last"+$.jgrid.jqID(tp)).click( function() {
				var cp = intNum(ts.p.page,1),
				last = intNum(ts.p.lastpage,1), selclick = false,
				fp=true, pp=true, np=true,lp=true;
				if(last ===0 || last===1) {fp=false;pp=false;np=false;lp=false; }
				else if( last>1 && cp >=1) {
					if( cp === 1) { fp=false; pp=false; }
					//else if( cp>1 && cp <last){ }
					else if( cp===last){ np=false;lp=false; }
				} else if( last>1 && cp===0 ) { np=false;lp=false; cp=last-1;}
				if( this.id === 'first'+tp && fp ) { ts.p.page=1; selclick=true;}
				if( this.id === 'prev'+tp && pp) { ts.p.page=(cp-1); selclick=true;}
				if( this.id === 'next'+tp && np) { ts.p.page=(cp+1); selclick=true;}
				if( this.id === 'last'+tp && lp) { ts.p.page=last; selclick=true;}
				if(selclick) {
					if(!clearVals(this.id)) { return false; }
					populate();
				}
				return false;
			});
			}
			if(ts.p.pginput===true) {
			$('input.ui-pg-input',"#"+pgcnt).keypress( function(e) {
				var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
				if(key == 13) {
					ts.p.page = ($(this).val()>0) ? $(this).val():ts.p.page;
					if(!clearVals('user')) { return false; }
					populate();
					return false;
				}
				return this;
			});
			}
		},
		sortData = function (index, idxcol,reload,sor){
			if(!ts.p.colModel[idxcol].sortable) { return; }
			var so;
			if(ts.p.savedRow.length > 0) {return;}
			if(!reload) {
				if( ts.p.lastsort == idxcol ) {
					if( ts.p.sortorder == 'asc') {
						ts.p.sortorder = 'desc';
					} else if(ts.p.sortorder == 'desc') { ts.p.sortorder = 'asc';}
				} else { ts.p.sortorder = ts.p.colModel[idxcol].firstsortorder || 'asc'; }
				ts.p.page = 1;
			}
			if(sor) {
				if(ts.p.lastsort == idxcol && ts.p.sortorder == sor && !reload) { return; }
				else { ts.p.sortorder = sor; }
			}
			var previousSelectedTh = ts.grid.headers[ts.p.lastsort].el, newSelectedTh = ts.grid.headers[idxcol].el;

			$("span.ui-grid-ico-sort",previousSelectedTh).addClass('ui-state-disabled');
			$(previousSelectedTh).attr("aria-selected","false");
			$("span.ui-icon-"+ts.p.sortorder,newSelectedTh).removeClass('ui-state-disabled');
			$(newSelectedTh).attr("aria-selected","true");
			if(!ts.p.viewsortcols[0]) {
				if(ts.p.lastsort != idxcol) {
					$("span.s-ico",previousSelectedTh).hide();
					$("span.s-ico",newSelectedTh).show();
				}
			}
			index = index.substring(5 + ts.p.id.length + 1); // bad to be changed!?!
			ts.p.sortname = ts.p.colModel[idxcol].index || index;
			so = ts.p.sortorder;
			if ($(ts).triggerHandler("jqGridSortCol", [index, idxcol, so]) === 'stop') {
				ts.p.lastsort = idxcol;
				return;
			}
			if($.isFunction(ts.p.onSortCol)) {if (ts.p.onSortCol.call(ts,index,idxcol,so)=='stop') {ts.p.lastsort = idxcol; return;}}
			if(ts.p.datatype == "local") {
				if(ts.p.deselectAfterSort) {$(ts).jqGrid("resetSelection");}
			} else {
				ts.p.selrow = null;
				if(ts.p.multiselect){setHeadCheckBox( false );}
				ts.p.selarrrow =[];
				ts.p.savedRow =[];
			}
			if(ts.p.scroll) {
				var sscroll = ts.grid.bDiv.scrollLeft;
				emptyRows(ts.grid.bDiv,true, false);
				ts.grid.hDiv.scrollLeft = sscroll;
			}
			if(ts.p.subGrid && ts.p.datatype=='local') {
				$("td.sgexpanded","#"+$.jgrid.jqID(ts.p.id)).each(function(){
					$(this).trigger("click");
				});
			}
			populate();
			ts.p.lastsort = idxcol;
			if(ts.p.sortname != index && idxcol) {ts.p.lastsort = idxcol;}
		},
		setColWidth = function () {
			var initwidth = 0, brd=isSafari? 0: intNum(ts.p.cellLayout,0), vc=0, lvc, scw=intNum(ts.p.scrollOffset,0),cw,hs=false,aw,gw=0,
			cl = 0, cr;
			$.each(ts.p.colModel, function() {
				if(typeof this.hidden === 'undefined') {this.hidden=false;}
				this.widthOrg = cw = intNum(this.width,0);
				if(this.hidden===false){
					initwidth += cw+brd;
					if(this.fixed) {
						gw += cw+brd;
					} else {
						vc++;
					}
					cl++;
				}
			});
			if(isNaN(ts.p.width)) {ts.p.width = grid.width = initwidth;}
			else { grid.width = ts.p.width;}
			ts.p.tblwidth = initwidth;
			if(ts.p.shrinkToFit ===false && ts.p.forceFit === true) {ts.p.forceFit=false;}
			if(ts.p.shrinkToFit===true && vc > 0) {
				aw = grid.width-brd*vc-gw;
				if(!isNaN(ts.p.height)) {
					aw -= scw;
					hs = true;
				}
				initwidth =0;
				$.each(ts.p.colModel, function(i) {
					if(this.hidden === false && !this.fixed){
						cw = Math.round(aw*this.width/(ts.p.tblwidth-brd*vc-gw));
						this.width =cw;
						initwidth += cw;
						lvc = i;
					}
				});
				cr =0;
				if (hs) {
					if(grid.width-gw-(initwidth+brd*vc) !== scw){
						cr = grid.width-gw-(initwidth+brd*vc)-scw;
					}
				} else if(!hs && Math.abs(grid.width-gw-(initwidth+brd*vc)) !== 1) {
					cr = grid.width-gw-(initwidth+brd*vc);
				}
				ts.p.colModel[lvc].width += cr;
				ts.p.tblwidth = initwidth+cr+brd*vc+gw;
				if(ts.p.tblwidth > ts.p.width) {
					ts.p.colModel[lvc].width -= (ts.p.tblwidth - parseInt(ts.p.width,10));
					ts.p.tblwidth = ts.p.width;
				}
			}
		},
		nextVisible= function(iCol) {
			var ret = iCol, j=iCol, i;
			for (i = iCol+1;i<ts.p.colModel.length;i++){
				if(ts.p.colModel[i].hidden !== true ) {
					j=i; break;
				}
			}
			return j-ret;
		},
		getOffset = function (iCol) {
			var i, ret = {}, brd1 = isSafari ? 0 : ts.p.cellLayout;
			ret[0] =  ret[1] = ret[2] = 0;
			for(i=0;i<=iCol;i++){
				if(ts.p.colModel[i].hidden === false ) {
					ret[0] += ts.p.colModel[i].width+brd1;
				}
			}
			if(ts.p.direction=="rtl") { ret[0] = ts.p.width - ret[0]; }
			ret[0] = ret[0] - ts.grid.bDiv.scrollLeft;
			if($(ts.grid.cDiv).is(":visible")) {ret[1] += $(ts.grid.cDiv).height() +parseInt($(ts.grid.cDiv).css("padding-top"),10)+parseInt($(ts.grid.cDiv).css("padding-bottom"),10);}
			if(ts.p.toolbar[0]===true && (ts.p.toolbar[1]=='top' || ts.p.toolbar[1]=='both')) {ret[1] += $(ts.grid.uDiv).height()+parseInt($(ts.grid.uDiv).css("border-top-width"),10)+parseInt($(ts.grid.uDiv).css("border-bottom-width"),10);}
			if(ts.p.toppager) {ret[1] += $(ts.grid.topDiv).height()+parseInt($(ts.grid.topDiv).css("border-bottom-width"),10);}
			ret[2] += $(ts.grid.bDiv).height() + $(ts.grid.hDiv).height();
			return ret;
		},
		getColumnHeaderIndex = function (th) {
			var i, headers = ts.grid.headers, ci = $.jgrid.getCellIndex(th);
			for (i = 0; i < headers.length; i++) {
				if (th === headers[i].el) {
					ci = i;
					break;
				}
			}
			return ci;
		};
		this.p.id = this.id;
		if ($.inArray(ts.p.multikey,sortkeys) == -1 ) {ts.p.multikey = false;}
		ts.p.keyIndex=false;
		for (i=0; i<ts.p.colModel.length;i++) {
			ts.p.colModel[i] = $.extend(true, {}, ts.p.cmTemplate, ts.p.colModel[i].template || {}, ts.p.colModel[i]);
			if (ts.p.keyIndex === false && ts.p.colModel[i].key===true) {
				ts.p.keyIndex = i;
			}
		}
		ts.p.sortorder = ts.p.sortorder.toLowerCase();
		if(ts.p.grouping===true) {
			ts.p.scroll = false;
			ts.p.rownumbers = false;
			ts.p.subGrid = false;
			ts.p.treeGrid = false;
			ts.p.gridview = true;
		}
		if(this.p.treeGrid === true) {
			try { $(this).jqGrid("setTreeGrid");} catch (_) {}
			if(ts.p.datatype != "local") { ts.p.localReader = {id: "_id_"};	}
		}
		if(this.p.subGrid) {
			try { $(ts).jqGrid("setSubGrid");} catch (s){}
		}
		if(this.p.multiselect) {
			this.p.colNames.unshift("<input role='checkbox' id='cb_"+this.p.id+"' class='cbox' type='checkbox'/>");
			this.p.colModel.unshift({name:'cb',width:isSafari ? ts.p.multiselectWidth+ts.p.cellLayout : ts.p.multiselectWidth,sortable:false,resizable:false,hidedlg:true,search:false,align:'center',fixed:true});
		}
		if(this.p.rownumbers) {
			this.p.colNames.unshift("");
			this.p.colModel.unshift({name:'rn',width:ts.p.rownumWidth,sortable:false,resizable:false,hidedlg:true,search:false,align:'center',fixed:true});
		}
		ts.p.xmlReader = $.extend(true,{
			root: "rows",
			row: "row",
			page: "rows>page",
			total: "rows>total",
			records : "rows>records",
			repeatitems: true,
			cell: "cell",
			id: "[id]",
			userdata: "userdata",
			subgrid: {root:"rows", row: "row", repeatitems: true, cell:"cell"}
		}, ts.p.xmlReader);
		ts.p.jsonReader = $.extend(true,{
			root: "rows",
			page: "page",
			total: "total",
			records: "records",
			repeatitems: true,
			cell: "cell",
			id: "id",
			userdata: "userdata",
			subgrid: {root:"rows", repeatitems: true, cell:"cell"}
		},ts.p.jsonReader);
		ts.p.localReader = $.extend(true,{
			root: "rows",
			page: "page",
			total: "total",
			records: "records",
			repeatitems: false,
			cell: "cell",
			id: "id",
			userdata: "userdata",
			subgrid: {root:"rows", repeatitems: true, cell:"cell"}
		},ts.p.localReader);
		if(ts.p.scroll){
			ts.p.pgbuttons = false; ts.p.pginput=false; ts.p.rowList=[];
		}
		if(ts.p.data.length) { refreshIndex(); }
		var thead = "<thead><tr class='ui-jqgrid-labels' role='rowheader'>",
		tdc, idn, w, res, sort,
		td, ptr, tbody, imgs,iac="",idc="";
		if(ts.p.shrinkToFit===true && ts.p.forceFit===true) {
			for (i=ts.p.colModel.length-1;i>=0;i--){
				if(!ts.p.colModel[i].hidden) {
					ts.p.colModel[i].resizable=false;
					break;
				}
			}
		}
		if(ts.p.viewsortcols[1] == 'horizontal') {iac=" ui-i-asc";idc=" ui-i-desc";}
		tdc = isMSIE ?  "class='ui-th-div-ie'" :"";
		imgs = "<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sort ui-icon-asc"+iac+" ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-"+dir+"'></span>";
		imgs += "<span sort='desc' class='ui-grid-ico-sort ui-icon-desc"+idc+" ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-"+dir+"'></span></span>";
		for(i=0;i<this.p.colNames.length;i++){
			var tooltip = ts.p.headertitles ? (" title=\""+$.jgrid.stripHtml(ts.p.colNames[i])+"\"") :"";
			thead += "<th id='"+ts.p.id+"_"+ts.p.colModel[i].name+"' role='columnheader' class='ui-state-default ui-th-column ui-th-"+dir+"'"+ tooltip+">";
			idn = ts.p.colModel[i].index || ts.p.colModel[i].name;
			thead += "<div id='jqgh_"+ts.p.id+"_"+ts.p.colModel[i].name+"' "+tdc+">"+ts.p.colNames[i];
			if(!ts.p.colModel[i].width)  { ts.p.colModel[i].width = 150; }
			else { ts.p.colModel[i].width = parseInt(ts.p.colModel[i].width,10); }
			if(typeof(ts.p.colModel[i].title) !== "boolean") { ts.p.colModel[i].title = true; }
			if (idn == ts.p.sortname) {
				ts.p.lastsort = i;
			}
			thead += imgs+"</div></th>";
		}
		thead += "</tr></thead>";
		imgs = null;
		$(this).append(thead);
		$("thead tr:first th",this).hover(function(){$(this).addClass('ui-state-hover');},function(){$(this).removeClass('ui-state-hover');});
		if(this.p.multiselect) {
			var emp=[], chk;
			$('#cb_'+$.jgrid.jqID(ts.p.id),this).bind('click',function(){
				ts.p.selarrrow = [];
				var froz = ts.p.frozenColumns === true ? ts.p.id + "_frozen" : "";
				if (this.checked) {
					$(ts.rows).each(function(i) {
						if (i>0) {
							if(!$(this).hasClass("ui-subgrid") && !$(this).hasClass("jqgroup") && !$(this).hasClass('ui-state-disabled')){
								$("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+$.jgrid.jqID(this.id) )[ts.p.useProp ? 'prop': 'attr']("checked",true);
								$(this).addClass("ui-state-highlight").attr("aria-selected","true");  
								ts.p.selarrrow.push(this.id);
								ts.p.selrow = this.id;
								if(froz) {
									$("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+$.jgrid.jqID(this.id), ts.grid.fbDiv )[ts.p.useProp ? 'prop': 'attr']("checked",true);
									$("#"+$.jgrid.jqID(this.id), ts.grid.fbDiv).addClass("ui-state-highlight");
								}
							}
						}
					});
					chk=true;
					emp=[];
				}
				else {
					$(ts.rows).each(function(i) {
						if(i>0) {
							if(!$(this).hasClass("ui-subgrid") && !$(this).hasClass('ui-state-disabled')){
								$("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+$.jgrid.jqID(this.id) )[ts.p.useProp ? 'prop': 'attr']("checked", false);
								$(this).removeClass("ui-state-highlight").attr("aria-selected","false");
								emp.push(this.id);
								if(froz) {
									$("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+$.jgrid.jqID(this.id), ts.grid.fbDiv )[ts.p.useProp ? 'prop': 'attr']("checked",false);
									$("#"+$.jgrid.jqID(this.id), ts.grid.fbDiv).removeClass("ui-state-highlight");
								}
							}
						}
					});
					ts.p.selrow = null;
					chk=false;
				}
				$(ts).triggerHandler("jqGridSelectAll", [chk ? ts.p.selarrrow : emp, chk]);
				if($.isFunction(ts.p.onSelectAll)) {ts.p.onSelectAll.call(ts, chk ? ts.p.selarrrow : emp,chk);}
			});
		}

		if(ts.p.autowidth===true) {
			var pw = $(eg).innerWidth();
			ts.p.width = pw > 0?  pw: 'nw';
		}
		setColWidth();
		$(eg).css("width",grid.width+"px").append("<div class='ui-jqgrid-resize-mark' id='rs_m"+ts.p.id+"'>&#160;</div>");
		$(gv).css("width",grid.width+"px");
		thead = $("thead:first",ts).get(0);
		var	tfoot = "";
		if(ts.p.footerrow) { tfoot += "<table role='grid' style='width:"+ts.p.tblwidth+"px' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><tr role='row' class='ui-widget-content footrow footrow-"+dir+"'>"; }
		var thr = $("tr:first",thead),
		firstr = "<tr class='jqgfirstrow' role='row' style='height:auto'>";
		ts.p.disableClick=false;
		$("th",thr).each(function ( j ) {
			w = ts.p.colModel[j].width;
			if(typeof ts.p.colModel[j].resizable === 'undefined') {ts.p.colModel[j].resizable = true;}
			if(ts.p.colModel[j].resizable){
				res = document.createElement("span");
				$(res).html("&#160;").addClass('ui-jqgrid-resize ui-jqgrid-resize-'+dir);
				if(!$.browser.opera) { $(res).css("cursor","col-resize"); }
				$(this).addClass(ts.p.resizeclass);
			} else {
				res = "";
			}
			$(this).css("width",w+"px").prepend(res);
			var hdcol = "";
			if( ts.p.colModel[j].hidden ) {
				$(this).css("display","none");
				hdcol = "display:none;";
			}
			firstr += "<td role='gridcell' style='height:0px;width:"+w+"px;"+hdcol+"'></td>";
			grid.headers[j] = { width: w, el: this };
			sort = ts.p.colModel[j].sortable;
			if( typeof sort !== 'boolean') {ts.p.colModel[j].sortable =  true; sort=true;}
			var nm = ts.p.colModel[j].name;
			if( !(nm == 'cb' || nm=='subgrid' || nm=='rn') ) {
				if(ts.p.viewsortcols[2]){
					$(">div",this).addClass('ui-jqgrid-sortable');
				}
			}
			if(sort) {
				if(ts.p.viewsortcols[0]) {$("div span.s-ico",this).show(); if(j==ts.p.lastsort){ $("div span.ui-icon-"+ts.p.sortorder,this).removeClass("ui-state-disabled");}}
				else if( j == ts.p.lastsort) {$("div span.s-ico",this).show();$("div span.ui-icon-"+ts.p.sortorder,this).removeClass("ui-state-disabled");}
			}
			if(ts.p.footerrow) { tfoot += "<td role='gridcell' "+formatCol(j,0,'', null, '', false)+">&#160;</td>"; }
		}).mousedown(function(e) {
			if ($(e.target).closest("th>span.ui-jqgrid-resize").length != 1) { return; }
			var ci = getColumnHeaderIndex(this);
			if(ts.p.forceFit===true) {ts.p.nv= nextVisible(ci);}
			grid.dragStart(ci, e, getOffset(ci));
			return false;
		}).click(function(e) {
			if (ts.p.disableClick) {
				ts.p.disableClick = false;
				return false;
			}
			var s = "th>div.ui-jqgrid-sortable",r,d;
			if (!ts.p.viewsortcols[2]) { s = "th>div>span>span.ui-grid-ico-sort"; }
			var t = $(e.target).closest(s);
			if (t.length != 1) { return; }
			var ci = getColumnHeaderIndex(this);
			if (!ts.p.viewsortcols[2]) { r=true;d=t.attr("sort"); }
			sortData( $('div',this)[0].id, ci, r, d);
			return false;
		});
		if (ts.p.sortable && $.fn.sortable) {
			try {
				$(ts).jqGrid("sortableColumns", thr);
			} catch (e){}
		}
		if(ts.p.footerrow) { tfoot += "</tr></tbody></table>"; }
		firstr += "</tr>";
		tbody = document.createElement("tbody");
		this.appendChild(tbody);
		$(this).addClass('ui-jqgrid-btable').append(firstr);
		firstr = null;
		var hTable = $("<table class='ui-jqgrid-htable' style='width:"+ts.p.tblwidth+"px' role='grid' aria-labelledby='gbox_"+this.id+"' cellspacing='0' cellpadding='0' border='0'></table>").append(thead),
		hg = (ts.p.caption && ts.p.hiddengrid===true) ? true : false,
		hb = $("<div class='ui-jqgrid-hbox" + (dir=="rtl" ? "-rtl" : "" )+"'></div>");
		thead = null;
		grid.hDiv = document.createElement("div");
		$(grid.hDiv)
			.css({ width: grid.width+"px"})
			.addClass("ui-state-default ui-jqgrid-hdiv")
			.append(hb);
		$(hb).append(hTable);
		hTable = null;
		if(hg) { $(grid.hDiv).hide(); }
		if(ts.p.pager){
			// TBD -- escape ts.p.pager here?
			if(typeof ts.p.pager == "string") {if(ts.p.pager.substr(0,1) !="#") { ts.p.pager = "#"+ts.p.pager;} }
			else { ts.p.pager = "#"+ $(ts.p.pager).attr("id");}
			$(ts.p.pager).css({width: grid.width+"px"}).appendTo(eg).addClass('ui-state-default ui-jqgrid-pager ui-corner-bottom');
			if(hg) {$(ts.p.pager).hide();}
			setPager(ts.p.pager,'');
		}
		if( ts.p.cellEdit === false && ts.p.hoverrows === true) {
		$(ts).bind('mouseover',function(e) {
			ptr = $(e.target).closest("tr.jqgrow");
			if($(ptr).attr("class") !== "ui-subgrid") {
				$(ptr).addClass("ui-state-hover");
			}
		}).bind('mouseout',function(e) {
			ptr = $(e.target).closest("tr.jqgrow");
			$(ptr).removeClass("ui-state-hover");
		});
		}
		var ri,ci, tdHtml;
		$(ts).before(grid.hDiv).click(function(e) {
			td = e.target;
			ptr = $(td,ts.rows).closest("tr.jqgrow");
			if($(ptr).length === 0 || ptr[0].className.indexOf( 'ui-state-disabled' ) > -1 || ($(td,ts).closest("table.ui-jqgrid-btable").attr('id') || '').replace("_frozen","") !== ts.id ) {
				return this;
			}
			var scb = $(td).hasClass("cbox"),
			cSel = $(ts).triggerHandler("jqGridBeforeSelectRow", [ptr[0].id, e]);
			cSel = (cSel === false || cSel === 'stop') ? false : true;
			if(cSel && $.isFunction(ts.p.beforeSelectRow)) { cSel = ts.p.beforeSelectRow.call(ts,ptr[0].id, e); }
			if (td.tagName == 'A' || ((td.tagName == 'INPUT' || td.tagName == 'TEXTAREA' || td.tagName == 'OPTION' || td.tagName == 'SELECT' ) && !scb) ) { return; }
			if(cSel === true) {
				ri = ptr[0].id;
				ci = $.jgrid.getCellIndex(td);
				tdHtml = $(td).closest("td,th").html();
				$(ts).triggerHandler("jqGridCellSelect", [ri,ci,tdHtml,e]);
				if($.isFunction(ts.p.onCellSelect)) {
					ts.p.onCellSelect.call(ts,ri,ci,tdHtml,e);
				}
				if(ts.p.cellEdit === true) {
					if(ts.p.multiselect && scb){
						$(ts).jqGrid("setSelection", ri ,true,e);
					} else {
						ri = ptr[0].rowIndex;
						try {$(ts).jqGrid("editCell",ri,ci,true);} catch (_) {}
					}
				} else if ( !ts.p.multikey ) {
					if(ts.p.multiselect && ts.p.multiboxonly) {
						if(scb){$(ts).jqGrid("setSelection",ri,true,e);}
						else {
							var frz = ts.p.frozenColumns ? ts.p.id+"_frozen" : "";
							$(ts.p.selarrrow).each(function(i,n){
								var ind = ts.rows.namedItem(n);
								$(ind).removeClass("ui-state-highlight");
								$("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+$.jgrid.jqID(n))[ts.p.useProp ? 'prop': 'attr']("checked", false);
								if(frz) {
									$("#"+$.jgrid.jqID(n), "#"+$.jgrid.jqID(frz)).removeClass("ui-state-highlight");
									$("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+$.jgrid.jqID(n), "#"+$.jgrid.jqID(frz))[ts.p.useProp ? 'prop': 'attr']("checked", false);
								}
							});
							ts.p.selarrrow = [];
							$(ts).jqGrid("setSelection",ri,true,e);
						}
					} else {
						$(ts).jqGrid("setSelection",ri,true,e);
					}
				} else {
					if(e[ts.p.multikey]) {
						$(ts).jqGrid("setSelection",ri,true,e);
					} else if(ts.p.multiselect && scb) {
						scb = $("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+ri).is(":checked");
						$("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+ri)[ts.p.useProp ? 'prop' : 'attr']("checked", scb);
					}
				}
			}
		}).bind('reloadGrid', function(e,opts) {
			if(ts.p.treeGrid ===true) {	ts.p.datatype = ts.p.treedatatype;}
			if (opts && opts.current) {
				ts.grid.selectionPreserver(ts);
			}
			if(ts.p.datatype=="local"){ $(ts).jqGrid("resetSelection");  if(ts.p.data.length) { refreshIndex();} }
			else if(!ts.p.treeGrid) {
				ts.p.selrow=null;
				if(ts.p.multiselect) {ts.p.selarrrow =[];setHeadCheckBox(false);}
				ts.p.savedRow = [];
			}
			if(ts.p.scroll) {emptyRows(ts.grid.bDiv,true, false);}
			if (opts && opts.page) {
				var page = opts.page;
				if (page > ts.p.lastpage) { page = ts.p.lastpage; }
				if (page < 1) { page = 1; }
				ts.p.page = page;
				if (ts.grid.prevRowHeight) {
					ts.grid.bDiv.scrollTop = (page - 1) * ts.grid.prevRowHeight * ts.p.rowNum;
				} else {
					ts.grid.bDiv.scrollTop = 0;
				}
			}
			if (ts.grid.prevRowHeight && ts.p.scroll) {
				delete ts.p.lastpage;
				ts.grid.populateVisible();
			} else {
				ts.grid.populate();
			}
			return false;
		})
		.dblclick(function(e) {
			td = e.target;
			ptr = $(td,ts.rows).closest("tr.jqgrow");
			if($(ptr).length === 0 ){return;}
			ri = ptr[0].rowIndex;
			ci = $.jgrid.getCellIndex(td);
			$(ts).triggerHandler("jqGridDblClickRow", [$(ptr).attr("id"),ri,ci,e]);
			if ($.isFunction(this.p.ondblClickRow)) { ts.p.ondblClickRow.call(ts,$(ptr).attr("id"),ri,ci, e); }
		})
		.bind('contextmenu', function(e) {
			td = e.target;
			ptr = $(td,ts.rows).closest("tr.jqgrow");
			if($(ptr).length === 0 ){return;}
			if(!ts.p.multiselect) {	$(ts).jqGrid("setSelection",ptr[0].id,true,e);	}
			ri = ptr[0].rowIndex;
			ci = $.jgrid.getCellIndex(td);
			$(ts).triggerHandler("jqGridRightClickRow", [$(ptr).attr("id"),ri,ci,e]);
			if ($.isFunction(this.p.onRightClickRow)) { ts.p.onRightClickRow.call(ts,$(ptr).attr("id"),ri,ci, e); }
		});
		grid.bDiv = document.createElement("div");
		if(isMSIE) { if(String(ts.p.height).toLowerCase() === "auto") { ts.p.height = "100%"; } }
		$(grid.bDiv)
			.append($('<div style="position:relative;'+(isMSIE && $.browser.version < 8 ? "height:0.01%;" : "")+'"></div>').append('<div></div>').append(this))
			.addClass("ui-jqgrid-bdiv")
			.css({ height: ts.p.height+(isNaN(ts.p.height)?"":"px"), width: (grid.width)+"px"})
			.scroll(grid.scrollGrid);
		$("table:first",grid.bDiv).css({width:ts.p.tblwidth+"px"});
		if( isMSIE ) {
			if( $("tbody",this).size() == 2 ) { $("tbody:gt(0)",this).remove();}
			if( ts.p.multikey) {$(grid.bDiv).bind("selectstart",function(){return false;});}
		} else {
			if( ts.p.multikey) {$(grid.bDiv).bind("mousedown",function(){return false;});}
		}
		if(hg) {$(grid.bDiv).hide();}
		grid.cDiv = document.createElement("div");
		var arf = ts.p.hidegrid===true ? $("<a role='link' href='javascript:void(0)'/>").addClass('ui-jqgrid-titlebar-close HeaderButton').hover(
			function(){ arf.addClass('ui-state-hover');},
			function() {arf.removeClass('ui-state-hover');})
		.append("<span class='ui-icon ui-icon-circle-triangle-n'></span>").css((dir=="rtl"?"left":"right"),"0px") : "";
		$(grid.cDiv).append(arf).append("<span class='ui-jqgrid-title"+(dir=="rtl" ? "-rtl" :"" )+"'>"+ts.p.caption+"</span>")
		.addClass("ui-jqgrid-titlebar ui-widget-header ui-corner-top ui-helper-clearfix");
		$(grid.cDiv).insertBefore(grid.hDiv);
		if( ts.p.toolbar[0] ) {
			grid.uDiv = document.createElement("div");
			if(ts.p.toolbar[1] == "top") {$(grid.uDiv).insertBefore(grid.hDiv);}
			else if (ts.p.toolbar[1]=="bottom" ) {$(grid.uDiv).insertAfter(grid.hDiv);}
			if(ts.p.toolbar[1]=="both") {
				grid.ubDiv = document.createElement("div");
				$(grid.uDiv).insertBefore(grid.hDiv).addClass("ui-userdata ui-state-default").attr("id","t_"+this.id);
				$(grid.ubDiv).insertAfter(grid.hDiv).addClass("ui-userdata ui-state-default").attr("id","tb_"+this.id);
				if(hg)  {$(grid.ubDiv).hide();}
			} else {
				$(grid.uDiv).width(grid.width).addClass("ui-userdata ui-state-default").attr("id","t_"+this.id);
			}
			if(hg) {$(grid.uDiv).hide();}
		}
		if(ts.p.toppager) {
			ts.p.toppager = $.jgrid.jqID(ts.p.id)+"_toppager";
			grid.topDiv = $("<div id='"+ts.p.toppager+"'></div>")[0];
			ts.p.toppager = "#"+ts.p.toppager;
			$(grid.topDiv).insertBefore(grid.hDiv).addClass('ui-state-default ui-jqgrid-toppager').width(grid.width);
			setPager(ts.p.toppager,'_t');
		}
		if(ts.p.footerrow) {
			grid.sDiv = $("<div class='ui-jqgrid-sdiv'></div>")[0];
			hb = $("<div class='ui-jqgrid-hbox"+(dir=="rtl"?"-rtl":"")+"'></div>");
			$(grid.sDiv).append(hb).insertAfter(grid.hDiv).width(grid.width);
			$(hb).append(tfoot);
			grid.footers = $(".ui-jqgrid-ftable",grid.sDiv)[0].rows[0].cells;
			if(ts.p.rownumbers) { grid.footers[0].className = 'ui-state-default jqgrid-rownum'; }
			if(hg) {$(grid.sDiv).hide();}
		}
		hb = null;
		if(ts.p.caption) {
			var tdt = ts.p.datatype;
			if(ts.p.hidegrid===true) {
				$(".ui-jqgrid-titlebar-close",grid.cDiv).click( function(e){
					var onHdCl = $.isFunction(ts.p.onHeaderClick),
					elems = ".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv",
					counter, self = this;
					if(ts.p.toolbar[0]===true) {
						if( ts.p.toolbar[1]=='both') {
							elems += ', #' + $(grid.ubDiv).attr('id');
						}
						elems += ', #' + $(grid.uDiv).attr('id');
					}
					counter = $(elems,"#gview_"+$.jgrid.jqID(ts.p.id)).length;

					if(ts.p.gridstate == 'visible') {
						$(elems,"#gbox_"+$.jgrid.jqID(ts.p.id)).slideUp("fast", function() {
							counter--;
							if (counter === 0) {
								$("span",self).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
								ts.p.gridstate = 'hidden';
								if($("#gbox_"+$.jgrid.jqID(ts.p.id)).hasClass("ui-resizable")) { $(".ui-resizable-handle","#gbox_"+$.jgrid.jqID(ts.p.id)).hide(); }
								$(ts).triggerHandler("jqGridHeaderClick", [ts.p.gridstate,e]);
								if(onHdCl) {if(!hg) {ts.p.onHeaderClick.call(ts,ts.p.gridstate,e);}}
							}
						});
					} else if(ts.p.gridstate == 'hidden'){
						$(elems,"#gbox_"+$.jgrid.jqID(ts.p.id)).slideDown("fast", function() {
							counter--;
							if (counter === 0) {
								$("span",self).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
								if(hg) {ts.p.datatype = tdt;populate();hg=false;}
								ts.p.gridstate = 'visible';
								if($("#gbox_"+$.jgrid.jqID(ts.p.id)).hasClass("ui-resizable")) { $(".ui-resizable-handle","#gbox_"+$.jgrid.jqID(ts.p.id)).show(); }
								$(ts).triggerHandler("jqGridHeaderClick", [ts.p.gridstate,e]);
								if(onHdCl) {if(!hg) {ts.p.onHeaderClick.call(ts,ts.p.gridstate,e);}}
							}
						});
					}
					return false;
				});
				if(hg) {ts.p.datatype="local"; $(".ui-jqgrid-titlebar-close",grid.cDiv).trigger("click");}
			}
		} else {$(grid.cDiv).hide();}
		$(grid.hDiv).after(grid.bDiv)
		.mousemove(function (e) {
			if(grid.resizing){grid.dragMove(e);return false;}
		});
		$(".ui-jqgrid-labels",grid.hDiv).bind("selectstart", function () { return false; });
		$(document).mouseup(function () {
			if(grid.resizing) {	grid.dragEnd(); return false;}
			return true;
		});
		ts.formatCol = formatCol;
		ts.sortData = sortData;
		ts.updatepager = updatepager;
		ts.refreshIndex = refreshIndex;
		ts.setHeadCheckBox = setHeadCheckBox;
		ts.constructTr = constructTr;
		ts.formatter = function ( rowId, cellval , colpos, rwdat, act){return formatter(rowId, cellval , colpos, rwdat, act);};
		$.extend(grid,{populate : populate, emptyRows: emptyRows});
		this.grid = grid;
		ts.addXmlData = function(d) {addXmlData(d,ts.grid.bDiv);};
		ts.addJSONData = function(d) {addJSONData(d,ts.grid.bDiv);};
		this.grid.cols = this.rows[0].cells;

		populate();ts.p.hiddengrid=false;
		$(window).unload(function () {
			ts = null;
		});
	});
};












//]그리드컨트롤 끝
})(jQuery);

