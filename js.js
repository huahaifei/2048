var board = new Array();
var hadAdd = new Array();
var score = 0;

var documentWidth = window.screen.availWidth;
var gridWidth = 0.92*documentWidth;
var cellwidth = 0.18*documentWidth;
var whiteSpace = 0.04*documentWidth;

var startX,startY,endX,endY;

$(function(){
	prepareMain();
	newGame();
	$('button').on('click',function(){newGame();});
	$('button').on('touchend',function(){newGame();});

	$('.result').on('click',function(){
		$('.result').css('display','none');
	})
	/*当游戏监听事件把默认事件去除后(e.preventDefault())，click事件将不能触发，需要使用touchend事件监听点击*/

	$('.result').on('touchend',function(e){  
		$('.result').css('display','none');
	});
})
function prepareMain(){
	if(documentWidth>500){
		gridWidth = 500;
		cellwidth = 100;
		whiteSpace = 20;
	}
	$('#grid_container').css({width:gridWidth-2*whiteSpace,
		height:gridWidth-2*whiteSpace,
		borderRadius:0.02*documentWidth,
		padding:whiteSpace});
	$('.result').css({width:gridWidth,
		height:gridWidth,
		borderRadius:0.02*documentWidth});
	$('.grid_cell').css({width:cellwidth,
		height:cellwidth,
		borderRadius:0.01*documentWidth,
		lineHeight:cellwidth});
}
function newGame(){

	init();//初始化

	generteNumber();//产生两个数字
	generteNumber();
}

document.addEventListener('touchstart',function(e){
	//e.preventDefault();
	startX = e.touches[0].pageX;
	startY = e.touches[0].pageY;
})
document.addEventListener('touchend',function(e){
	//e.preventDefault();
	endX = e.changedTouches[0].pageX;
	endY = e.changedTouches[0].pageY;

	var movelengthX = endX-startX;
	var movelengthY = endY-startY;
	if(Math.abs(movelengthX)<0.2*documentWidth&&Math.abs(movelengthY)<0.2*documentWidth)
		return;
	if(Math.abs(movelengthX)>Math.abs(movelengthY)){
		if(endX>startX){
			if(moveRight()){
				setTimeout("generteNumber()",200);
				setTimeout("isGameover()",300);
			}
		}else{
			if(moveLeft()){
				setTimeout("generteNumber()",200);
				setTimeout("isGameover()",300);
			}
		}
	}else{
		if(endY>startY){
			if(moveDown()){
				setTimeout("generteNumber()",200);
				setTimeout("isGameover()",300);
			}
		}else{
			if(moveUp()){
				setTimeout("generteNumber()",200);
				setTimeout("isGameover()",300);
			}
		}
	}
})
$(document).keydown(function(event){//响应上下左右移动
	//isGameover();
	//event.preventDefault(); //不能进行键盘的操作，如F5刷新,输入框能进行输入但不能退格删除
	switch(event.keyCode){ 
		case 37:
			if(moveLeft()){
				setTimeout("generteNumber()",200);
				setTimeout("isGameover()",300);
			}
			break;
		case 38:
			if(moveUp()){
				setTimeout("generteNumber()",200);
				setTimeout("isGameover()",300);
			}
			break;
		case 39:
			if(moveRight()){
				setTimeout("generteNumber()",200);
				setTimeout("isGameover()",300);
			}
			break;
		case 40:
			if(moveDown()){
				setTimeout("generteNumber()",200);
				setTimeout("isGameover()",300);
			}
			break;
		default:
			break;
	}
})
function isGameover(){
	if(nospace()&&!canMoveUp()&&!canMoveLeft()&&!canMoveRight()&&!canMoveDown()){
		$('.result').css("display","block");
		$('.result span').text(score);
	}
}
function moveUp(){
	if(!canMoveUp()){
		return false;
	}
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++)
			if(board[j][i]!=0){
				for(var k=0;k<j;k++){
					if(board[k][i]==0&&nomask(j,i,k,i)){
						moveShow(j,i,k,i);
						board[k][i] = board[j][i];
						board[j][i] = 0;
						continue;
					}
					if(board[k][i]==board[j][i]&&nomask(j,i,k,i)&&!hadAdd[k][i]){
						moveShow(j,i,k,i);
						board[k][i] += board[j][i];
						board[j][i] = 0;
						score+=board[k][i];
						hadAdd[k][i] = true;
						continue;
					}
				}
			}
	}
	setTimeout("updateBoardView()",200);
	return true;
}
function canMoveUp(){
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(board[j][i]!=0)
				if(board[j-1][i]==0||board[j-1][i]==board[j][i])
					return true;
		}
	}
	return false;
}
function moveLeft(){
	if(!canMoveLeft()){
		return false;console.log(1);
	}
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++)
			if(board[i][j]!=0){
				for(var k=0;k<j;k++){
					if(board[i][k]==0&&nomask(i,j,i,k)){
						moveShow(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					if(board[i][k]==board[i][j]&&nomask(i,j,i,k)&&!hadAdd[i][k]){
						moveShow(i,j,i,k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						score += board[i][k];
						hadAdd[i][k] = true;
						continue;
					}
				}
			}
	}
	setTimeout("updateBoardView()",200);
	return true;
}
function canMoveLeft(){
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(board[i][j]!=0)
				if(board[i][j-1]==0||board[i][j-1]==board[i][j])
					return true;
		}
	}
	return false;
}
function moveRight(){
	if(!canMoveRight()){
		return false;
	}
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--)
			if(board[i][j]!=0){
				for(var k=3;k>j;k--){
					if(board[i][k]==0&&nomask(i,j,i,k)){
						moveShow(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					if(board[i][k]==board[i][j]&&nomask(i,j,i,k)&&!hadAdd[i][k]){
						moveShow(i,j,i,k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						score += board[i][k];
						hadAdd[i][k] = true;
						continue;
					}
				}
			}
	}
	setTimeout("updateBoardView()",200);
	return true;
}
function canMoveRight(){
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(board[i][j]!=0)
				if(board[i][j+1]==0||board[i][j+1]==board[i][j])
					return true;
		}
	}
	return false;
}
function moveDown(){
	if(!canMoveDown()){
		return false;
	}
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--)
			if(board[j][i]!=0){
				for(var k=3;k>j;k--){
					if(board[k][i]==0&&nomask(j,i,k,i)){
						moveShow(j,i,k,i);
						board[k][i] = board[j][i];
						board[j][i] = 0;
						continue;
					}
					if(board[k][i]==board[j][i]&&nomask(j,i,k,i)&&!hadAdd[k][i]){
						moveShow(j,i,k,i);
						board[k][i] += board[j][i];
						board[j][i] = 0;
						score +=board[k][i];
						hadAdd[k][i] = true;
						continue;
					}
				}
			}
	}
	setTimeout("updateBoardView()",200);
	return true;
}
function canMoveDown(){
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(board[j][i]!=0)
				if(board[j+1][i]==0||board[j+1][i]==board[j][i])
					return true;
		}
	}
	return false;
}
function getMargin(num){
	return (cellwidth+whiteSpace)*num;
}
function moveShow(fromX,fromY,toX,toY){
	var number_cell = $('#number_cell_'+fromX+'_'+fromY);
	/*number_cell.animate({marginLeft:toY*120+'px',
					marginTop:toX*120+'px'},200);*/
	number_cell.animate({marginLeft:getMargin(toY),
					marginTop:getMargin(toX)});
}
function nomask(fromX,fromY,toX,toY){
	if(fromX == toX){
		maxY = fromY>toY?fromY:toY;
		minY = fromY<toY?fromY:toY;
		for(var i=minY+1;i<maxY;i++){
			if(board[fromX][i]!=0)
				return false;
		}
	}else if(fromY == toY){
		maxX = fromX>toX?fromX:toX;
		minX = fromX<toX?fromX:toX;
		for(var i=minX+1;i<maxX;i++){
			if(board[i][fromY]!=0)
				return false;
		}
	}		
	return true;
}
function generteNumber(){ //随机位子生成一个数字
	if(nospace())
		return false;
	/*var timer = 0;
	while(timer < 50){
		var randX = parseInt(Math.floor(Math.random()*4));
		var randY = parseInt(Math.floor(Math.random()*4));
		if(board[randX][randY] == 0)
			break;
	}
	if(timer == 50){
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(board[i][j]==0){
					randX = i;
					randY = j;
				}
			}
		}
	}*/
	var space = [];
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(board[i][j]==0){
				oneSpace = {x:i,y:j};
				space.push(oneSpace);
			}
		}
	}
	var x = parseInt(Math.floor(Math.random()*space.length));
	randX = space[x].x;
	randY = space[x].y;
	var randNum = Math.random()>0.5?2:4;
	board[randX][randY] = randNum;
	showRandNumber(randX,randY,randNum);
}
function showRandNumber(randX,randY,randNum){
	var numBox = $('#number_cell_'+randX+'_'+randY);
	numBox.css({backgroundColor:getNumberBackgroundColor(randNum),
				color:getNumberColor(randNum)});
	numBox.text(randNum);
	/*numBox.animate({marginLeft:randY*120+'px',
				marginTop:randX*120+'px',
				width:'100px',
				height:'100px',
				},50);*/
	numBox.animate({marginLeft:getMargin(randY),
				marginTop:getMargin(randX),
				width:cellwidth,
				height:cellwidth,
				},50);
}
function nospace(){
	for (var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++){
			if(board[i][j] == 0)
				return false;
		}
	}
	return true;
}
function init(){
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var cell = $("#grid_cell_"+i+"_"+j);
			cell.css({marginLeft:getMargin(j),
					marginTop:getMargin(i)});
		}
	}
	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		hadAdd[i] = new Array();
		for (var j = 0; j < 4; j++) {
			board[i][j] = 0;
			hadAdd[i][j] = false;
		}
	}
	updateBoardView();
}
function updateBoardView(){//刷新页面展示
	$('.number_cell').remove();
	$('header p span').html(score);
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$('#grid_container').append('<div class="number_cell" id="number_cell_'+i
				+'_'+j+'"></div>');
			var cell = $("#number_cell_"+i+"_"+j);
			if(board[i][j]==0){
				cell.css({marginLeft:getMargin(j),
					marginTop:getMargin(i),
					width:0,
					height:0})
			}else{			
				cell.css({marginLeft:getMargin(j),
					marginTop:getMargin(i),
					width:cellwidth,
					height:cellwidth,
					backgroundColor:getNumberBackgroundColor(board[i][j]),
					color:getNumberColor(board[i][j])});
				cell.text(board[i][j]);
			}
			hadAdd[i][j] = false;
		}
	}
	/*setTimeout(function(){
		for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var cell = $("#number_cell_"+i+"_"+j);
			if(board[i][j]==2048){
				cell.css('font-size',0.4*cellwidth+'px');
			}else{
				cell.css('font-size',0.6*cellwidth+'px');
			}
		}
	}
	}
	,50);*/
	
	$('.number_cell').css('line-height',cellwidth+'px');
    $('.number_cell').css('font-size',0.4*cellwidth+'px');
}
function getNumberColor(number){
	if(number<=4){
		return '#776e65';
	}
	return '#fff';
}
function getNumberBackgroundColor(number){
    switch(number){
    	case 2:return "#eee4da";break;
    	case 4:return "#ede0c8";break;
    	case 8:return "#f2b179";break;
    	case 16:return "#f59563";break;
    	case 32:return "#f67c5f";break;
    	case 64:return "#f65e3b";break;
    	case 128:return "#edcf72";break;
    	case 258:return "#edcc61";break;
    	case 512:return "#9c0";break;
    	case 1024:return "#33b5e5";break;
    	case 2048:return "#09c";break;
    	case 4096:return "#a6c";break;
    	case 8192:return "#93c";break;
    }
    return '#000';
}
