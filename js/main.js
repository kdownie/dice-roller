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