$(document).ready(function() {
	initialize();

	$('#addSet').click(function() {
		var count = $('.set').length+1;
		addSet(count, false);
		addDie(count, 0, 0, 0, 0, 0, 0, 0);
	});
});
	

function initialize() {
	var setCount = $.cookie('setCount');

	if (setCount == undefined) {
		addSet(1, false);
		$('#set1Collapse').addClass('collapse in');
		addDie(1, 0, 0, 0, 0, 0, 0, 0);
	}
	else {
		for (var i = 1; i <= setCount; i++) {
			addSet(i);
			if ($.cookie('set'+i) != undefined) {
				try {
					var cookie = $.cookie('set'+i);

					var die = cookie.split(';');
					var j = 1;
					$.each(die, function() {
						var aDie = (die[j-1].split('-')[0]).split(',');
						var dDie = (die[j-1].split('-')[1]).split(',');
						
						addDie(i, aDie[0], aDie[1], aDie[2], dDie[0], dDie[1], dDie[2], dDie[3]);
						j++;
					});
				}
				catch(err) {
					console.log(err.message);
				}
			}
		}
	}

	if (setCount == 1) {
		$('#set1Collapse').addClass('in');
		$('.collapsed').removeClass('collapsed');
	}
}

function addSet(setL, collapsed) {
	var text = '';
	var cclass = ' class="collapsed"';
	if (collapsed == false) {
		text = ' in';
		cclass = '';
	}
	$('#setBuilder .sets').append(''
		+'<div id="set'+setL+'" class="set panel panel-default readyMode">'
			+'<div class="panel-heading">'
				+'Set'+setL
				+'<button id="rollDice" class="btn btn-primary pull-right readyMode">Roll Attack</button>'
				+'<a'+cclass+' href="#" data-toggle="collapse" data-target="#set'+setL+'Collapse" aria-controls="set'+setL+'Collapse" aria-expanded="true"><div class="collapser">'
				+'<span class="glyphicon glyphicon-chevron-right"></span><span class="glyphicon glyphicon-chevron-down"></span>'
				+'</div></a>'
			+'</div>'
			+'<div id="set'+setL+'Collapse" class="panel-body setContainer collapse'+text+'">'
				+'<div class="dieContainer panel panel-default col-lg-12">'
					+'<div class="panel-heading col-lg-6">Attack Rolls</div>'
					+'<div class="panel-heading col-lg-6">Damage Rolls</div>'
				+'</div>'
				+'<button id="editDice" class="btn btn-default pull-right readyMode">Edit</button>'
				+'<button id="saveDice" class="btn btn-success pull-right editMode">Save</button>'
				+'<button id="addDice" class="btn btn-default pull-right editMode">Add Die</button>'
			+'</div>'
		+'</div>');

	$('#set'+setL+' #editDice').click(function() {
		$(this).parents('.set').removeClass('readyMode').addClass('editMode');
	})

	$('#set'+setL+' #saveDice').click(function() {
		$.removeCookie($(this).parents('.set').attr('id'));
		var builtCookie = "";

		var i = 1;
		$($(this).parents('.set').find('.dieSet')).each(function() {
			if (i > 1) {
				builtCookie += ';';
			}
			builtCookie += $(this).find('#adieCount').val()+','
				+$(this).find('#adieType').val()+','
				+$(this).find('#aiBonus').val()+'-';

			builtCookie += $(this).find('#dieCount').val()+','
				+$(this).find('#dieType').val()+','
				+$(this).find('#iBonus').val()+','
				+$(this).find('#tBonus').val();
			i++;
		});

		$.cookie($(this).parents('.set').attr('id'), builtCookie);
		$.cookie('setCount', $('.set').length);

		updateDiceValues($(this).parents('.set').attr('id'));
		$(this).parents('.set').removeClass('editMode').addClass('readyMode');
		$('.active').removeClass('active');
	})

	$('#set'+setL+' #rollDice').click(function() {
		rollAttack($(this).parents('.set').attr('id'));
	});

	$('#set'+setL+' #addDice').click(function() {
		addDie($(this).parents('.set').attr('id').substring(3), 0, 0, 0, 0, 0, 0, 0);
	});
}

function addDie(set, aCount, aType, aBonus, dCount, dType, diBonus, dtBonus) {
	var dieCount = $('#set'+set+' .attackDie').length+1;
	$('#set'+set+' .dieContainer').append('<div class="clearfix panel panel-default dieSet dieSet'+dieCount+'"></div>');

	$('#set'+set+' .dieSet'+dieCount).append(''
		+'<div class="attackDie'+dieCount+' attackDie">'
			+'<div class="panel-body col-lg-6 readyMode">'
				+'<span id="ardieCount">'+aCount+'</span> d '
				+'<span id="ardieType">'+aType+'</span> + '
				+'<span id="ariBonus">'+aBonus+'</span>'
			+'</div>'
			+'<div class="panel-body col-lg-6 editMode">'
				+'<input id="adieCount" type="text"> d '
				+'<input id="adieType" type="text"> + '
				+'<input id="aiBonus" type="text">'
			+'</div>'
		+'</div>');

	$('#set'+set+' .dieSet'+dieCount).append(''
		+'<div class="damageDie'+dieCount+' damageDie clearfix">'
			+'<div class="modBox editMode"></div>'
			+'<div class="panel-body col-lg-6 readyMode">'
				+'<span id="rdieCount">'+dCount+'</span> d '
				+'<span id="rdieType">'+dType+'</span> + '
				+'<span id="riBonus">'+diBonus+'</span> + '
				+'<span id="rtBonus">'+dtBonus+'</span>'
			+'</div>'
			+'<div class="panel-body col-lg-6 editMode">'
				+'<input id="dieCount" type="text"> d '
				+'<input id="dieType" type="text"> + '
				+'<input id="iBonus" type="text"> + '
				+'<input id="tBonus" type="text">'
			+'</div>'
			+'<div class="panel-body col-lg-12 editMode modPanel">'
				+'<div class="col-lg-6"></div>'
				+'<div class="col-lg-6"></div>'
			+'</div>'
		+'</div>');

	$('#set'+set+' .dieSet'+dieCount+' .modBox').append(''
		+'<button type="button" id="close'+dieCount+'"" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
		+'<button type="button" class="btn btn-default editAdvanced"><span class="glyphicon glyphicon-cog"></span></button>');

	$('#set'+set+' .dieSet'+dieCount+' .editAdvanced').click(function() {
		$(this).parent().siblings('.modPanel').toggleClass('active');
	});

	$('#set'+set+' .dieSet'+dieCount+' .close').click(function() {
		$('.dieSet'+$(this).attr('id').substring(5)).remove();
	});

	$('#set'+set+' .attackDie'+dieCount+' #adieCount').val(aCount);
	$('#set'+set+' .attackDie'+dieCount+' #adieType').val(aType);
	$('#set'+set+' .attackDie'+dieCount+' #aiBonus').val(aBonus);

	$('#set'+set+' .damageDie'+dieCount+' #dieCount').val(dCount);
	$('#set'+set+' .damageDie'+dieCount+' #dieType').val(dType);
	$('#set'+set+' .damageDie'+dieCount+' #iBonus').val(diBonus);
	$('#set'+set+' .damageDie'+dieCount+' #tBonus').val(dtBonus);
}

function updateDiceValues(set) {
	$('#'+set+' .attackDie').each(function() {
		$(this).find('#ardieCount').html($(this).find('#adieCount').val());
		$(this).find('#ardieType').html($(this).find('#adieType').val());
		$(this).find('#ariBonus').html($(this).find('#aiBonus').val());
	});
	
	$('#'+set+' .damageDie').each(function() {
		$(this).find('#rdieCount').html($(this).find('#dieCount').val());
		$(this).find('#rdieType').html($(this).find('#dieType').val());
		$(this).find('#riBonus').html($(this).find('#iBonus').val());
		$(this).find('#rtBonus').html($(this).find('#tBonus').val());
	});
}

var currentSet;

function rollAttack(set) {
	currentSet = set;

	$('#attackRollContainer').html('');
	
	var j = 1;
	var k = 1;
	$('#'+set+' .attackDie').each(function() {
		var dieCount = parseInt($(this).find('#adieCount').val());
		var dieType = parseInt($(this).find('#adieType').val());
		var individualBonus = parseInt($(this).find('#aiBonus').val());

		for (var i = 1; i <= dieCount; i++) {
			$('#attackRollContainer').append('<div id="attackRoll'+j+'" class="panel panel-default" data-damageType="'+k+'"></div>');

			var cont = $($('#attackRollContainer').children()[j-1]);
			cont.append('<div class="panel-heading">Attack '+j+': </div>')

			var attackRoll = Math.ceil(Math.random()*dieType);

			cont.append('<div class="panel-body"><span>'+attackRoll+'+'+individualBonus+' (d'+dieType+')</span></div>');
			cont.children('.panel-heading').append('<span class="attackResult">'+(attackRoll+individualBonus)+'</span>');

			cont.children('.panel-heading').append('<button id="attackHit'+j+'" class="attackHit btn btn-success pull-right">Hit</button>'
				+'<button id="attackMiss'+j+'" class="attackMiss btn btn-danger pull-right">Miss</button>');

			setDamageEvent('#attackRoll'+j+' #attackHit'+j, '#attackRoll'+j, 'panel-success');
			setMissEvent('#attackRoll'+j+' #attackMiss'+j, '#attackRoll'+j, 'panel-danger')
			j++;
		}
		k++;
	});


	$('#attackRollContainer').append('<button id="rollDamage" class="btn btn-primary pull-right" onclick="rollDamage()" style="display: none;">Roll Damage</button>');
}

function setDamageEvent(target, container, add) {
	$(target).click(function() {
		$(container).removeClass('panel-default').removeClass('panel-danger').removeClass('panel-success').removeClass('panel-warning').removeClass('panel-info').addClass(add);
		if ($('#attackRollContainer .panel-default').length == 0) {
			$('#rollDamage').attr('style','');
		}
	})
}

function setMissEvent(target, container, add) {
	$(target).click(function() {
		$(container).removeClass('panel-default').removeClass('panel-danger').removeClass('panel-success').removeClass('panel-warning').removeClass('panel-info').addClass(add);
		if ($('#attackRollContainer .panel-default').length == 0) {
			$('#rollDamage').attr('style','');
		}
	})
}

function rollDamage() {
	$('#rollDamage').attr('style','display:none;');

	var dieCount;
	var dieType;
	var individualBonus;
	var totalBonus;
	var addSymbol;
	
	var finalResult = 0;

	$('#rollBreakdown').html('');
	$('#bonusBreakdown').html('');

	var j = 1;
	$('.panel-success .attackHit').each(function() {
		var damageType = $(this).parents('.panel').attr('data-damagetype');
		dieCount = parseInt($('#'+currentSet+' .damageDie'+damageType+' #dieCount').val());
		dieType = parseInt($('#'+currentSet+' .damageDie'+damageType+' #dieType').val());
		individualBonus = parseInt($('#'+currentSet+' .damageDie'+damageType+' #iBonus').val());
		totalBonus = parseInt($('#'+currentSet+' .damageDie'+damageType+' #tBonus').val());
			
		if (individualBonus != 0) {
			$('#bonusBreakdown').append('('+individualBonus);
			if (dieCount > 1) {
				$('#bonusBreakdown').append('x'+dieCount);
			}
			finalResult += individualBonus*dieCount;
		}

		$('#rollBreakdown').append('(');
		for(var i = 1; i <= dieCount; i++) {
			thisRoll = Math.ceil(Math.random()*dieType);
			addSymbol = '+';

			if (i == dieCount) {
				addSymbol = '';
			}

			$('#rollBreakdown').append('<span id="roll'+i+'" class="dieRoll"><span>'+thisRoll+'</span></span>'+addSymbol);

			finalResult += thisRoll;
		}
		$('#rollBreakdown').append(')');
		if (j < $('.panel-success .attackHit').length) {
			$('#rollBreakdown').append('+');
		}

		if (totalBonus != 0) {
			$('#bonusBreakdown').append('+'+totalBonus);
			finalResult += totalBonus;
		}
		$('#bonusBreakdown').append(')'+addSymbol);
		if (j < $('.panel-success .attackHit').length) {
			$('#bonusBreakdown').append('+');
		}
		j++;
	});

	$('#result').html(''+finalResult);
}