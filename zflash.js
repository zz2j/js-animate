//zflash animate lib. by zz2j 2015.4.21

/* byturn operate */
/* with operate */

var zflash; 
zflash = function(){

	//request animation frame
    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function( f ){ setTimeout( f, 1000/60 ); };

	//get element
	var elem = function(id){
		return document.getElementById(id);
	};

	//set style 
	var style = function(e,prop,value){
		//opacity
		if (prop === 'opacity') {
			var ie = GetIEVersion();
			if (ie && (ie == 8) ){
				e.style[ "-ms-filter" ] = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.floor( value * 100 ) + ")";
	            e.style.filter = "alpha(opacity=" + Math.floor( value * 100 ) + ")";
			}else{
				e.style[prop] = value;
			}
		}else{
		// other style
			e.style[prop] = value + 'px';
		}
	};

	//begs like {key:value};
	var animate = function(transform){
		return function(id,dur,begs,ends){
			return {
				dur:dur,
				fn:function(t){
					var e = elem(id);
					for(var prop in begs){
						var begValue = begs[prop];
						var endValue = ends[prop];
						var dx = endValue - begValue;

						var percentage = transform(t/dur > 0? t/dur: 0);
						//percentage changes;then place changes and place chaging speed changes;
						var currentValue = begValue + percentage * dx;
						style(e,prop,currentValue);
					}
				}
			};
		};
	};

	//main animate list; to continue; 
	var linear = animate(function(p){return p});
	var easeIn = animate(function(p){return Math.pow(p,5)});
	var easeOut = animate(function(p){return 1-Math.pow(1-p,5)});
	var sleep = function(dur){
		return {dur:dur,fn:function(t){}};
	};
	var easeFn = {
		'linear':linear,
		'easeOut':easeOut,
		'easeIn':easeIn
	};

	//animate
	var move = function(id,dur,begs,ends,type){
		return easeFn[type](id,dur,begs,ends);
	};	

	//get ie version
	//if ie then return ie version. else return false.
	function GetIEVersion(){
		if (navigator.appName == 'Microsoft Internet Explorer')
	        {
	            var ua = navigator.userAgent;
	            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	            if (re.exec(ua) !== null)
	                return parseFloat( RegExp.$1 );
	        }
	     return false;
	};

	//excute in turn;
	var go = function(){
		var list = Array.prototype.slice.call(arguments,0);
		var dur = 0;
		for(var i = 0;i < list.length; i++){
			dur += list[i].dur;
		};
		return {
			dur:dur,
			fn:function(t){
				var passed = 0;
				for(var i = 0;i<list.length;i++){
					if (t < (passed + list[i].dur)) {
						list[i].fn(t - passed);
						return;
					};
					if(!list[i].done){
						list[i].done = true;
					}
					passed += list[i].dur;
				}
			}
		}
	};

	//excute with
	var sync = function(){
		var list = Array.prototype.slice.call(arguments,0);
		var dur = 0;
		for(var i = 0;i < list.length; i++){
			dur = Math.max(dur,list[i].dur);
		};
		return{
			dur:dur,
			fn:function(t){
				for(var i = 0;i<list.length;i++){
					if(t < list[i].dur) list[i].fn(t);
					else{
						if (!list[i].done) {list[i].done = true;};
					}
				}
			}
		}
	};

	var begTime = (+new Date()); //unix time

	//render function;
	var render = function(dur){
		var cur = (+new Date());
		var passed = cur - begTime;
		if (passed < dur) {
			raf(render);
		};
		if(window.render) window.render.fn(passed);
	}
	return {
		//animate
		move:move,
		//go in turn 
		go: go,
		//go sync
		sync:sync,
		//do nothing
		sleep:sleep,
		//render
		render:render
	};

}();