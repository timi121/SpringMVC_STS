/*
의존성 (dependancy)
1 jQuery
2 jQueryUI and theme
3 jLinq
4 JSON2(더글라스 크록포드)
5 maousewheel 플러그인(http://brandonaaron.net/code/mousewheel/docs)

- 현재까지 구현된 기능
	초기화, jQuery UI의 테마적용
	데이타바인딩
	Fixed Column
	
- 구현해야 할 기능(우선순위에 따라)
	정렬(좌측/중앙/우측)
	풍선도움말
	페이징
	[CRUD]Row Selection(이벤트핸들러추가)
	[CRUD]Row Editing
	[CRUD]Row Add and Delete
	[CRUD]다중선택(멀티삭제 삭제할때만 쓰지 않나?)
	[CRUD]Edited data transfer(저장기능..)
	
	Column Sizing
	Sort Order기능(엔터프라이즈 환경에선 별로..)

	
- $grid.data("") 관련항목
	config : 설정사항
	rows : 데이터 Array객체
	rowsOrigin : 데이터 Array객체 원본
	rowCount : 총 레코드 갯수
	page : 현재페이지
	startPage : 페이지버튼의 시작시퀀스
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
		"height": 250, //그리드의 default height
		"width": 500, //그리드의 default width
		"gridTitle" : "Sample Grid",
		"multiSelect" : false, //다중선택 여부
		"colSizes" : [], 
		"headerCells" : [[]],
		"fixedCols" : 0, //틀고정칼럼 갯수
		"usingCUD" : false,//CUD사용여부(insert update delete기능)
		"pageSize" : 10,//페이징 사용시 한 페이지에 나타나는 Row수(실제로 10건만 연산하진 않음-total페이지 구하는 용도로만 사용)
		"none" : ""
	},
	defaultBodyCell : {
		"bindCol" : ""
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
					"<span style='RIGHT:2px;position:absolute' class='ui-icon-container'>"+
					//"<SPAN class='ui-icon ui-icon-circle-triangle-n'></SPAN>"+
					"</span>"+
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
			//페이저영역
			.append("<div style='position:relative;bottom:0px;' class='ui-state-default ui-helper-clearfix jqkg-pagerbar'>"+
					//페이저
					"<SPAN class='jqkg-pager'></SPAN>" +
					//기타 기능버튼? TODO
					//"" +
					"</div>");
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
		
		//기본 설정값
		$grid.data("page",1).data("startPage",1);
		
//		$grid.find(".jqkg-table-bl,.jqkg-table-br").on("mousedown",function(){
//			alert('tt');
//		});
		//$(document).on('scroll',
	},
	//데이터를 바인딩시킨다.
	bind : function(gridSelector, data){

		var $grid = $(gridSelector);
		var rows = data.rows;
		//data의 갯수만큼 돌면서 그리드의 바디를 채워줌
		for(var i =0;i<rows.length;i++){
			rows[i]["_jqkgRowId"] = i;//row id
			rows[i]["_jqkgRowStat"] = "R";//Read, Updated, Deleted, Created
		}
		//데이터셋 객체가 참조되는 것을 막기 위해서 JSON객체를 이용해서 동적으로 객체를 다시 만들어주었음(json2.js사용)
		var rowsStr = JSON.stringify(rows);
		$grid.data("rowsOrigin",JSON.parse(rowsStr));  
		$grid.data("rows",JSON.parse(rowsStr));
		if(data.rowCount) $grid.data("rowCount",data.rowCount);
		//$grid.data("data")[0]["a"] = "abc";
		//alert($grid.data("dataOrigin")[0]["a"] );
		$.jqkGridComm.generateBody(gridSelector);
		$.jqkGridComm.generatePager(gridSelector);
	},
	reset :  function(gridSelector){ //TODO수정기능작업 후에 잘 돌아가는지 테스트...
		var $grid = $(gridSelector);
		//일단은 기바인딩된 현재의 데이터 Row들을 털어버린다. 
		$grid.find(".jqkg-table-bl table tr,.jqkg-table-br table tr").remove();
		var rowsStr = JSON.stringify($grid.data("rowsOrigin"));
		$grid.data("rows",JSON.parse(rowsStr));
		$.jqkGridComm.generateBody(gridSelector);
	},
	generateBody : function(gridSelector){
		var $grid = $(gridSelector);
		
		$grid.find(".jqkg-table-bl table tr,.jqkg-table-br table tr").remove();//기바인딩된 현재의 데이터 Row들을 털어버린다. 
		
		var rows = $grid.data("rows");
		var config = $grid.data("config");

		for(var i =0;i<rows.length;i++){//defaultBodyCell
			for(var j=0;j<config.bodyCells.length;j++){// 바디Row만큼 루핑//일반적으로는 1개..
				var cells = config.bodyCells[j];
				var $trFixed = $("<tr _jqkgRowId='"+ rows[i]["_jqkgRowId"] +"'/>");
				var $trUnFixed = $("<tr _jqkgRowId='"+ rows[i]["_jqkgRowId"] +"'/>");
				for(var k=0;k<cells.length;k++){
					var sTd = "<td class='ui-widget-content' title='"+rows[i][cells[k].bindCol]+"'><div class='jqkg-ellipsis'>"+ rows[i][cells[k].bindCol] +"</td>"; 
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
	generatePager : function(gridSelector){
		var $grid = $(gridSelector);
		var $pager = $grid.find(".jqkg-pager");
		$pager.find("button,span").remove();//페이지버튼들을 모두 지운다
		
		var page = $grid.data("page")-0; //현재페이지
		var pageSize = $grid.data("config").pageSize-0; //페이지당 레코드 갯수
		var startPage = $grid.data("startPage")-0; //시작페이지
		var rowCount = $grid.data("rowCount")-0; //전체레코드 수
		//alert(((rowCount-1)/pageSize).toFixed(0));
		var pageCount = Math.floor((rowCount-1)/pageSize)+1;//전체페이지수
		//alert(pageCount);
		//alert("startPage"+startPage + ":pageCount"+pageCount);
		
		if(startPage == 1) $("<button>first</button>").button({"icons":{"primary":"ui-icon-seek-first"},text: false,"disabled":true}).appendTo($pager);
		else $("<button>first</button>").button({"icons":{"primary":"ui-icon-seek-first"},text: false}).appendTo($pager);
		
		if(startPage == 1) $("<button>prev</button>").button({"icons":{"primary":"ui-icon-seek-prev"},text: false,"disabled":true}).appendTo($pager);
		else $("<button>prev</button>").button({"icons":{"primary":"ui-icon-seek-prev"},text: false}).appendTo($pager);
		
		for(var i=startPage;i<=startPage+9 && i<=pageCount;i++){
			if(i==page) $("<button> "+i+" </button>").button({"disabled":true}).appendTo($pager);
			else $("<button> "+i+" </button>").button().appendTo($pager);
		}
		
		if(startPage+9 > pageCount) $("<button>next</button>").button({"icons":{"primary":"ui-icon-seek-next"},text: false,"disabled":true}).appendTo($pager);
		else $("<button>next</button>").button({"icons":{"primary":"ui-icon-seek-next"},text: false}).appendTo($pager);
		
		if(startPage > Math.floor(pageCount/10)*10) $("<button>last</button>").button({"icons":{"primary":"ui-icon-seek-end"},text: false,"disabled":true}).appendTo($pager);
		else $("<button>last</button>").button({"icons":{"primary":"ui-icon-seek-end"},text: false}).appendTo($pager);
		
		$("<span>  [ "+ page +" / " + pageCount + " ]</span>").appendTo($pager);
		/*
		$grid.find(".jqkg-pager").append("<span><span class='ui-icon ui-icon-seek-first'></span></span>");
		$grid.find(".jqkg-pager").append("<span><span class='ui-icon ui-icon-seek-prev'></span></span>");
		$grid.find(".jqkg-pager").append("<span><span class='ui-button'>11</span></span>");
		*/
		/*
		for(var i=startPage;i<=startPage+9 && i<=pageCount;i++){
			//alert(i);
			$grid.find(".jqkg-pager").append("<span class='jqkg-pager-number-button'>"+i+"</span>");
		}
		*/
		/*
		$grid.find(".jqkg-pager").append("<span><span class='ui-icon ui-icon-seek-next'></span></span>");
		$grid.find(".jqkg-pager").append("<span><span class='ui-icon ui-icon-seek-end'></span></span>");
		*/
		//$grid.find(".jqkg-pager span.jqkg-pager-button").button();
		
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
//마우스휠 이벤트 받아서 세로스크롤 변화시켜준다. mousewheel jquery 플러그인 사용
$(document).on("mousewheel", ".jqkg-table-bl,.jqkg-table-br", function(event, delta, deltax, deltay) {//.jqkg .jqkg-content .jqkg-table .jqkg-table-br
	var $grd = $.jqkGridComm.getGrid(this);
	//$grd.find(".jqkg-vscroll-in").trigger("mousewheel");
	$grd.find(".jqkg-vscroll-in").scrollTop(this.scrollTop-delta*30);
	//alert(delta);
	return false;
});
////스크롤이벤트
/* 플러그인으로 해결해서 필요 없을듯..
$(window).on("scroll",".jqkg-hscroll-in", function(){
	alert('tt');
});
$(window).on('scroll', '.jqkg-hscroll-in', function() {
	alert('abcd');
});
*/
//페이저 관련 이벤트
$(document).on("click", ".jqkg .jqkg-pager button", function(e){
	var $grd = $.jqkGridComm.getGrid(this);
	var val = $(this).children(".ui-button-text").text();
	if(val=="first"){ //1페이지
		$grd.data("startPage",1);
		$grd.jqkGrid("generatePager");
	} else if(val == "prev"){ //이전10개
		var startPage = $grd.data("startPage")-0;
		$grd.data("startPage", startPage-10);
		$grd.jqkGrid("generatePager");
	} else if(val == "next") { //다음 10개
		var startPage = $grd.data("startPage")-0;
		$grd.data("startPage", startPage+10);
		$grd.jqkGrid("generatePager");
	} else if(val == "last") { //마지막라운드
		var pageSize = $grd.data("config").pageSize-0; //페이지당 레코드 갯수
		//var startPage = $grid.data("startPage")-0; //시작페이지
		var rowCount = $grd.data("rowCount")-0; //전체레코드 수
		//alert(((rowCount-1)/pageSize).toFixed(0));
		var pageCount = Math.floor((rowCount-1)/pageSize)+1;//전체페이지수
		var newStartPage =  Math.floor(pageCount/10)*10+1;
		$grd.data("startPage", newStartPage);
		$grd.jqkGrid("generatePager");
	} else if( !isNaN(val)) { //숫자지정
		alert(val +"페이징처리  콜백함수 호출");
		//호출 한 후에..
		$grd.data("page", val);
		$grd.jqkGrid("generatePager");
		
	}
	//alert(this.innerHTML);
	//alert(val);
	e.preventDefault();
});

//아이콘 관련 이벤트 
/* 필요 없을듯..
$(document).on("mouseover",".jqkg .ui-icon-container",function(){
	$(this).addClass("ui-state-hover");
});
$(document).on("mouseout",".jqkg .ui-icon-container",function(){
	$(this).removeClass("ui-state-hover");
	//alert("out");
});
*/
//아이콘 관련 이벤트
/* 이미지 깨짐.. 우선순위 낮으니 추후 구현..
$(".jqkg-icon").live("mouseover",function(){
	$(this).addClass("ui-state-active");
}).live("mouseout",function(){
	$(this).removeClass("ui-state-active");
});
*/




/////////////////////
// 이벤트 끝..
//////////////////////



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
	
};












//]그리드컨트롤 끝
})(jQuery);

