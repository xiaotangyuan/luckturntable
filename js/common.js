// =======new code======
function gen_award_name_list(){
	// 生成奖品代码中的 称号数组
	var base_award_string = 'award';
	var award_name_list = [];
	for (var i = 0; i < 10; i++) {
		var award_name = base_award_string + i;
		award_name_list.push(award_name);
	}
	return award_name_list
}

var award_name_list = gen_award_name_list();
//console.log(award_name_list);

function set_award_remain_num(award_name, remain_num){
	// 设置奖品剩余数量
	// award_name = 'award1'
	localStorage[award_name] = parseInt(remain_num);
}

function get_award_remain_num(award_name){
	// 获取奖品剩余数量
	var val = localStorage[award_name];
	if(val == undefined){
		return 0;
	}
	return parseInt(val)
}

function reduce_award_remain_num(award_name){
	// 减掉奖品数量1个
	var award_remain_num = get_award_remain_num(award_name);
	if (award_remain_num > 0) {
		var remain_num = award_remain_num - 1;
		set_award_remain_num(award_name, remain_num);
	}else{
		//console.log('this award is over:' + award_name);
	}
}

function GetRandomNum(Min,Max){   
	var Range = Max - Min;   
	var Rand = Math.random();   
	return(Min + Math.round(Rand * Range));   
}

function get_shoot_award_name(){
	// 从剩余的奖品中随机抽取一个奖品，返回奖品名称 （会自动将奖品数量减1
	// 如果返回 undefined 表示已经没有奖品了
	award_items_list = [];
	for (var i = 0; i < award_name_list.length; i++) {
		var award_remain_num = get_award_remain_num(award_name_list[i]);
		if (award_remain_num == 0) {
			continue
		}
		for (var j = 0; j < award_remain_num; j++) {
			award_items_list.push(award_name_list[i]);
		};
	};
	random_max = award_items_list.length - 1;
	if(random_max <= 0){
		random_max = 0;
	}
	theindex = GetRandomNum(0, random_max);
	var award_name = award_items_list[theindex];
	reduce_award_remain_num(award_name);
	return award_name
}
function get_remain_all_award_num(){
	// 获取所有剩余奖品数量
	var num = 0;
	for (var i = 0; i < award_name_list.length; i++) {
		var award_remain_num = get_award_remain_num(award_name_list[i]);
		if (award_remain_num == 0) {
			continue
		}
		for (var j = 0; j < award_remain_num; j++) {
			num = num + 1;
		};
	};
	return num;
}
//获取保存的值
function show_new_award(){
	for (var i = 0; i < award_name_list.length; i++) {
	var award_name = award_name_list[i];
	$('.'+award_name).val(get_award_remain_num(award_name));
	};
}
// =============
// 
$(function(){
		//设置每个奖品的位置
        //中心点横坐标
        var dotLeft = ($(".container").width()-$(".center").width())/2;
        //中心点纵坐标
        var dotTop = ($(".container").height()-$(".center").height())/2;
        //起始角度
        var stard = 0;
        //半径
        var radius = 200;
        //每一个BOX对应的角度;
        var avd = 360/$(".box").length;
        //每一个BOX对应的弧度;
        var ahd = -avd*Math.PI/180;
        //设置圆的中心点的位置
        $(".center").css({"left":dotLeft,"top":dotTop});
        $(".box").each(function(index, element){
            $(this).css({"left":-Math.sin((ahd*index))*radius+dotLeft,"top":-Math.cos((ahd*index))*radius+dotTop});
        });
        //点击设置奖品数量
		$('.check').on('click',function(){
			show_new_award();
			var form = $('.awardForm');
			if(form.hasClass('on')){
				$(this).html('设置与查看奖品数量 <span><<</span>');
				form.removeClass('on');
			}else{
				$(this).html('收起 <span>>></span>');
				$('.awardForm').addClass('on');
			}
		})
		show_new_award();
		//当前奖品索引
		var index = 0;
		//旋转速度
		var speed = 0;
		//随机奖品
		var random;
		var circle = 0;
        //旋转停留时间
        function get_time(i){
        	if (i>5) {
        		return i*70;
        	}
        	return i*50;
        }
        //点击关闭弹框
        $('.modal-content .close').on('click',function(){
        	$('.modal').hide();
        	show_new_award();
        })
        //点击提交获取奖品数量
        $('.submit').on('click',function(){
        	for (var i = 0; i < award_name_list.length; i++) {
        		var award_name = award_name_list[i];
        		set_award_remain_num(award_name, $('.'+award_name).val());
        	};
        	alert('奖品设置成功！')
        	//$('.modal-content').html('<h2>设置成功</h2><span class="close">x</span>').css('padding',0).parent().show();
        })
        //点击开始抽奖
		$('.center').on('click',function(){
			var remain_all_award_num = get_remain_all_award_num();
			//判断是否还有
			if(remain_all_award_num == 0){
				$('.modal-content h2').html('奖品已领完！');
				$('.modal-content p').html('');
				$('.modal').show();
				return;
			}
			var award_name = get_shoot_award_name();
			var award_content = $('.'+award_name).parent().text();
			run(50, award_name);
		});
		function run(speed,award_name){
			var num = award_name.substr(award_name.length-1,1);
			var random = $('.jiangp'+num).index()+1;
			var timer = setInterval(function(){	
				index = $('.box.active').index();
				index++;
				if(index > 10){
					index = 1;
					circle ++;
					//console.log(circle);
				}
				$('.box').removeClass('active');
				$('.box').eq(index-1).addClass('active');
				if(circle >=2){
					speed = 3000;
				}
				if(circle>=3){
					speed = 5000;
				}
				if((circle>=4 && index == random) || circle>=6){
					clearInterval(timer);
					circle = 0;
					var award = $('.box').eq(index-1).data('award');
					$('.modal-content h2').html('恭喜，中奖啦！');
					$('.modal p.awardContent').html(award);
					$('.modal').show();
				}
			},speed);
		}
    })
