
/**
 * 변수=값&변수=값.... 형식으로 반환 
 */
(function( $ ){
	$.fn.serializeJSON=function() {
	var json = {};
	jQuery.map($(this).serializeArray(), function(n, i){
	json[n['name']] = n['value'];
	});
	return json;
	};
})( jQuery );