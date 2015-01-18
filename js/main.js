$(document).ready(function() {
	initialize();
	$('#editDice').click(function() {
		$('#setBuilder').removeClass('readyMode').addClass('editMode');
	})

	$('#saveDice').click(function() {
		updateDiceValues();
		$('#setBuilder').removeClass('editMode').addClass('readyMode');
	})

	$('#rollDice').click(function() {
		var dieCount = parseInt($('#dieCount').val());
		var dieType = parseInt($('#dieType').val());
		var individualBonus = parseInt($('#iBonus').val());
		var totalBonus = parseInt($('#tBonus').val());
		
		var finalResult = 0;

		$('#rollBreakdown').html('');
		$('#bonusBreakdown').html('+');
		if (individualBonus != 0) {
			$('#bonusBreakdown').append('('+individualBonus+'x'+dieCount+')');
			finalResult += individualBonus*dieCount;
		}

		for(i = 0; i < dieCount; i++) {
			thisRoll = Math.ceil(Math.random()*dieType);
			var addSymbol = '+';

			if (i == dieCount-1) {
				addSymbol = '';
			}

			$('#rollBreakdown').append('<span id="roll'+(i+1)+'" class="dieRoll"><span>'+thisRoll+'</span></span>'+addSymbol);

			finalResult += thisRoll;
		}

		if (totalBonus != 0) {
			$('#bonusBreakdown').append('+'+totalBonus);
			finalResult += totalBonus;
		}

		$('#result').html(''+finalResult);
	});
});
	

function initialize() {
	updateDiceValues();
}

function updateDiceValues() {
	$('#ardieCount').html($('#adieCount').val());
	$('#ardieType').html($('#adieType').val());
	$('#ariBonus').html($('#aiBonus').val());

	$('#rdieCount').html($('#dieCount').val());
	$('#rdieType').html($('#dieType').val());
	$('#riBonus').html($('#iBonus').val());
	$('#rtBonus').html($('#tBonus').val());
}