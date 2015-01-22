$(document).ready(function() {
	initialize();
	$('#editDice').click(function() {
		$('#setBuilder').removeClass('readyMode').addClass('editMode');
	})

	$('#saveDice').click(function() {
		updateDiceValues($(this).parents('.set').attr('id'));
		$('#setBuilder').removeClass('editMode').addClass('readyMode');
	})

	$('#rollDice').click(function() {
		rollAttack($(this).parents('.set').attr('id'));
	});

	$('#addDice').click(function() {
		var nextSet = $(this).parents('.set').find('.attackDie').length+1;
		$(this).parents('.set').find('.attackRolls').append('<div class="attackDie'+nextSet+' attackDie">'
			+$(this).parents('.set').find('.attackDie1').html()
			+'<div>');
		$(this).parents('.set').find('.damageRolls').append('<div class="damageDie'+nextSet+' damageDie">'
			+$(this).parents('.set').find('.damageDie1').html()
			+'<div>');
	});
});
	

function initialize() {
	$('.set').each(function() {
		updateDiceValues($(this).attr('id'));
	})
	
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

	var dieCount = parseInt($('#'+set+' #adieCount').val());
	var dieType = parseInt($('#'+set+' #adieType').val());
	var individualBonus = parseInt($('#'+set+' #aiBonus').val());

	$('#attackRollContainer').html('');

	for (var i = 1; i <= dieCount; i++) {
		$('#attackRollContainer').append('<div id="attackRoll'+i+'" class="panel panel-default"></div>');

		var cont = $($('#attackRollContainer').children()[i-1]);
		cont.append('<div class="panel-heading">Attack '+i+': </div>')

		var attackRoll = Math.ceil(Math.random()*dieType);

		cont.append('<div class="panel-body"><span>'+attackRoll+'</span></div>');
		cont.children('.panel-heading').append('<span class="attackResult">'+(attackRoll+individualBonus)+'</span>');

		cont.children('.panel-heading').append('<button id="attackHit'+i+'" class="attackHit btn btn-success pull-right">Hit</button>'
			+'<button id="attackMiss'+i+'" class="attackMiss btn btn-danger pull-right">Miss</button>');

		setDamageEvent('#attackRoll'+i+' #attackHit'+i, '#attackRoll'+i, 'panel-success');
		setMissEvent('#attackRoll'+i+' #attackMiss'+i, '#attackRoll'+i, 'panel-danger')
	}

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

	var dieCount = parseInt($('#'+currentSet+' #dieCount').val());
	var dieType = parseInt($('#'+currentSet+' #dieType').val());
	var individualBonus = parseInt($('#'+currentSet+' #iBonus').val());
	var totalBonus = parseInt($('#'+currentSet+' #tBonus').val());
	var addSymbol;
	
	var finalResult = 0;

	$('#rollBreakdown').html('');
	$('#bonusBreakdown').html('');

	for (var j = 1; j <= $('.panel-success .attackHit').length; j++) {
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
	}

	$('#result').html(''+finalResult);
}