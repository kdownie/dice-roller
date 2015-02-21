$(document).ready(function() {
	initialize();

	$('#addAttackSet').click(function() {
		var count = $('.set').length+1;
		addAttackSet(count, false);
		addAttackDie(count, 0, 0, 0, 0, 0, 0, 0);
	});

	$('#addRollSet').click(function() {
		var count = $('.set').length+1;
		addRollSet(count, false);
		addRollDie(count, 0, 0, 0);
	});

	$('#addDamageSet').click(function() {
		var count = $('.set').length+1;
		addDamageSet(count, false);
		addDamageDie(count, 0, 0, 0, 0);
	});
});
	

function initialize() {
	var setCount = $.cookie('setCount');

	if (setCount == undefined) {
		addAttackSet(1, false);
		$('#set1Collapse').addClass('collapse in');
		addAttackDie(1, 0, 0, 0, 0, 0, 0, 0);
	}
	else {
		for (var i = 1; i <= setCount; i++) {
			if ($.cookie('set'+i) != undefined) {
				try {
					var cookie = $.cookie('set'+i);
					var sections = cookie.split('`');

					switch (sections[2]) {
						case '0':
							addAttackSet(i);
							addAttackCookie(sections, i);
							break;
						case '1':
							addRollSet(i);
							addRollCookie(sections, i);
							break;
						case '2':
							addDamageSet(i);
							addDamageCookie(sections, i);
							break;
					}
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

function addAttackCookie(sections, i) {
	$('#set'+i+' .setTitle').html(sections[0]);
	$('#set'+i+' .setTitleEdit').val(sections[0]);

	var die = sections[1].split(';');
	var j = 1;
	$.each(die, function() {
		var aDie = (die[j-1].split('-')[0]).split(',');
		var dDie = (die[j-1].split('-')[1]).split(',');
		
		addAttackDie(i, aDie[0], aDie[1], aDie[2], dDie[0], dDie[1], dDie[2], dDie[3]);
		j++;
	});
}

function addRollCookie(sections, i) {
	$('#set'+i+' .setTitle').html(sections[0]);
	$('#set'+i+' .setTitleEdit').val(sections[0]);

	var die = sections[1].split(';');
	var j = 1;
	$.each(die, function() {
		var aDie = die[j-1].split(',');
		
		addRollDie(i, aDie[0], aDie[1], aDie[2]);
		j++;
	});
}

function addDamageCookie(sections, i) {
	$('#set'+i+' .setTitle').html(sections[0]);
	$('#set'+i+' .setTitleEdit').val(sections[0]);

	var die = sections[1].split(';');
	var j = 1;
	$.each(die, function() {
		var dDie = die[j-1].split(',');
		
		addDamageDie(i, dDie[0], dDie[1], dDie[2], dDie[3]);
		j++;
	});
}

function addAttackSet(setL, collapsed) {
	var text = '';
	var cclass = ' collapsed';
	var editMode = 'readyMode';
	if (collapsed == false) {
		text = ' in';
		cclass = '';
		editMode = 'editMode'
	}
	$('#setBuilder .sets').append(spitSetHTML(0, setL, text, cclass, editMode));

	$('#set'+setL+' .setTitleEdit').val('Set'+setL);

	$('#set'+setL+' #editDice').click(function() {
		$(this).parents('.set').removeClass('readyMode').addClass('editMode');
	})

	$('#set'+setL+' #saveDice').click(function() {
		var setId = $(this).parents('.set').attr('id');
		saveSet(setId, 0);
	})

	$('#set'+setL+' #rollDice').click(function() {
		rollAttack($(this).parents('.set').attr('id'));
	});

	$('#set'+setL+' #addDice').click(function() {
		addAttackDie($(this).parents('.set').attr('id').substring(3), 0, 0, 0, 0, 0, 0, 0);
	});

	$('#set'+setL+' .setActions .close').click(function() {
		deleteSet(setL);
	});
}

function addRollSet(setL, collapsed) {
	var text = '';
	var cclass = ' collapsed';
	var editMode = 'readyMode';
	if (collapsed == false) {
		text = ' in';
		cclass = '';
		editMode = 'editMode'
	}
	$('#setBuilder .sets').append(spitSetHTML(1, setL, text, cclass, editMode));

	$('#set'+setL+' .setTitleEdit').val('Set'+setL);

	$('#set'+setL+' #editDice').click(function() {
		$(this).parents('.set').removeClass('readyMode').addClass('editMode');
	})

	$('#set'+setL+' #saveDice').click(function() {
		var setId = $(this).parents('.set').attr('id');
		saveSet(setId, 1);
	})

	$('#set'+setL+' #rollDice').click(function() {
		rollDice($(this).parents('.set').attr('id'));
	});

	$('#set'+setL+' #addDice').click(function() {
		addRollDie($(this).parents('.set').attr('id').substring(3), 0, 0, 0);
	});

	$('#set'+setL+' .setActions .close').click(function() {
		deleteSet(setL);
	});
}

function addDamageSet(setL, collapsed) {
	var text = '';
	var cclass = ' collapsed';
	var editMode = 'readyMode';
	if (collapsed == false) {
		text = ' in';
		cclass = '';
		editMode = 'editMode'
	}
	$('#setBuilder .sets').append(spitSetHTML(2, setL, text, cclass, editMode));

	$('#set'+setL+' .setTitleEdit').val('Set'+setL);

	$('#set'+setL+' #editDice').click(function() {
		$(this).parents('.set').removeClass('readyMode').addClass('editMode');
	})

	$('#set'+setL+' #saveDice').click(function() {
		var setId = $(this).parents('.set').attr('id');
		saveSet(setId, 2);
	})

	$('#set'+setL+' #rollDice').click(function() {
		rollDamage($(this).parents('.set').attr('id'));
	});

	$('#set'+setL+' #addDice').click(function() {
		addDamageDie($(this).parents('.set').attr('id').substring(3), 0, 0, 0, 0);
	});

	$('#set'+setL+' .setActions .close').click(function() {
		deleteSet(setL);
	});
}

function saveSet(set, setType) {
	var setTitle = $('#'+set).find('.setTitleEdit').val();
		
	$.removeCookie(set);
	$('#'+set).find('.setTitle').html(setTitle);

	var builtCookie = setTitle;

	builtCookie += '`';
	var i = 1;
	$($('#'+set).find('.dieSet')).each(function() {
		if (i > 1) {
			builtCookie += ';';
		}
		if (setType == 0 || setType == 1) {
			builtCookie += $(this).find('#adieCount').val()+','
				+$(this).find('#adieType').val()+','
				+$(this).find('#aiBonus').val();

			if (setType == 0) {
				builtCookie += '-';
			}
		}

		if (setType == 0 || setType == 2) {
			builtCookie += $(this).find('#dieCount').val()+','
				+$(this).find('#dieType').val()+','
				+$(this).find('#iBonus').val()+','
				+$(this).find('#tBonus').val();
		}
		i++;
	});

	builtCookie += '`'+setType;

	$.cookie(set, builtCookie);
	$.cookie('setCount', $('.set').length);

	updateDiceValues(set);
	$('#'+set).removeClass('editMode').addClass('readyMode');
	$('.active').removeClass('active');
}

function deleteSet(set) {
	$('#set'+set).remove();
	$.removeCookie('set'+set);

	var i = set+1;
	var nextCookie = $.cookie('set'+i);
	while (nextCookie != undefined) {
		$.cookie('set'+(i-1), nextCookie);
		$.removeCookie('set'+i);

		i++;
		nextCookie = $.cookie('set'+i);
	}

	$.cookie('setCount', parseInt($.cookie('setCount'))-1);
}

function addAttackDie(set, aCount, aType, aBonus, dCount, dType, diBonus, dtBonus) {
	var dieCount = $('#set'+set+' .dieSet').length+1;
	$('#set'+set+' .dieContainer').append('<div class="clearfix panel panel-default dieSet dieSet'+dieCount+'"></div>');

	var dieSet = $('#set'+set+' .dieSet'+dieCount);
	dieSet.append(spitADHTML(0, 6, dieCount, aCount, aType, aBonus));
	dieSet.append(spitDDHTML(0, 6, dieCount, dCount, dType, diBonus, dtBonus));

	dieSet.append(spitModBoxHTML(dieCount));

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

function addRollDie(set, aCount, aType, aBonus) {
	var dieCount = $('#set'+set+' .dieSet').length+1;
	$('#set'+set+' .dieContainer').append('<div class="clearfix panel panel-default dieSet dieSet'+dieCount+'"></div>');

	var dieSet = $('#set'+set+' .dieSet'+dieCount);
	dieSet.append(spitADHTML(1, 12, dieCount, aCount, aType, aBonus));

	dieSet.append(spitModBoxHTML(dieCount));

	$('#set'+set+' .dieSet'+dieCount+' .editAdvanced').click(function() {
		$(this).parent().siblings('.modPanel').toggleClass('active');
	});

	$('#set'+set+' .dieSet'+dieCount+' .close').click(function() {
		$('.dieSet'+$(this).attr('id').substring(5)).remove();
	});

	$('#set'+set+' .attackDie'+dieCount+' #adieCount').val(aCount);
	$('#set'+set+' .attackDie'+dieCount+' #adieType').val(aType);
	$('#set'+set+' .attackDie'+dieCount+' #aiBonus').val(aBonus);
}

function addDamageDie(set, dCount, dType, diBonus, dtBonus) {
	var dieCount = $('#set'+set+' .damageDie').length+1;
	$('#set'+set+' .dieContainer').append('<div class="clearfix panel panel-default dieSet dieSet'+dieCount+'"></div>');

	var dieSet = $('#set'+set+' .dieSet'+dieCount);
	dieSet.append(spitDDHTML(2, 12, dieCount, dCount, dType, diBonus, dtBonus));

	dieSet.append(spitModBoxHTML(dieCount));

	$('#set'+set+' .dieSet'+dieCount+' .editAdvanced').click(function() {
		$(this).parent().siblings('.modPanel').toggleClass('active');
	});

	$('#set'+set+' .dieSet'+dieCount+' .close').click(function() {
		$('.dieSet'+$(this).attr('id').substring(5)).remove();
	});

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
			setMissEvent('#attackRoll'+j+' #attackMiss'+j, '#attackRoll'+j, 'panel-danger');
			j++;
		}
		k++;
	});

	$('#attackBreakdown').removeClass('hide');
	$('#damageBreakdown').addClass('hide');
	$('#attackRollContainer').append('<button id="rollDamage" class="btn btn-primary pull-right" onclick="rollAttackDamage()" style="display: none;">Roll Damage</button>');
}

function rollDice(set) {
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
			cont.append('<div class="panel-heading">Roll '+j+': </div>')

			var attackRoll = Math.ceil(Math.random()*dieType);

			cont.append('<div class="panel-body"><span>'+attackRoll+'+'+individualBonus+' (d'+dieType+')</span></div>');
			cont.children('.panel-heading').append('<span class="attackResult">'+(attackRoll+individualBonus)+'</span>');

			j++;
		}
		k++;
	});

	$('#attackBreakdown').removeClass('hide');
	$('#damageBreakdown').addClass('hide');
}

function rollDamage(set) {
	currentSet = set;
	$('#attackBreakdown').addClass('hide');

	$('#attackRollContainer').html('');
	
	var j = 1;
	var k = 1;
	$('#'+set+' .dieSet').each(function() {
			$('#attackRollContainer').append('<div id="attackRoll'+j+'" class="panel panel-success" data-damageType="'+k+'"></div>');

			var cont = $($('#attackRollContainer').children()[j-1]);
			cont.append('<div class="panel-body attackHit"></div>');
			j++;
		k++;
	});

	$('#damageBreakdown').addClass('hide');
	rollAttackDamage();
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

function rollAttackDamage() {
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
			$('#bonusBreakdown').append('+('+individualBonus);
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
		if (individualBonus != 0) {
			$('#bonusBreakdown').append(')'+addSymbol);
			
		}
		j++;
	});

	$('#damageBreakdown').removeClass('hide');
	$('#result').html(''+finalResult);
}

function spitSetHTML(setType, setL, text, cclass, editMode) {
	var diceHTML = '';
	var buttonHTML = '';

	switch (setType) {
		case 0:
		default:
			diceHTML = '<div class="panel-heading col-lg-6 col-sm-6 col-xs-6">Attack Rolls</div>'
								+'<div class="panel-heading col-lg-6 col-sm-6 col-xs-6">Damage Rolls</div>';
			buttonHTML = 'Roll Attack';
			break;
		case 1:
			diceHTML = '<div class="panel-heading col-lg-12 col-sm-12 col-xs-12">Dice Rolls</div>';
			buttonHTML = 'Roll Dice';
			break;
		case 2:
			diceHTML = '<div class="panel-heading col-lg-12 col-sm-12 col-xs-12">Damage Rolls</div>';
			buttonHTML = 'Roll Damage';
			break;
	}

	return '<div id="set'+setL+'" class="set attackSet panel panel-default '+editMode+'">'
			+'<div class="panel-heading">'
				+'<span class="setTitle readyMode">Set'+setL+'</span>'
				+'<input class="setTitleEdit editMode" type="text"></input>'
				+'<button id="rollDice" class="btn btn-primary pull-right readyMode">'+buttonHTML+'</button>'
				+'<div class="setActions editMode"><button id="deleteSet1" class="close" aria-label="close" type="button"><span aria-hidden="true">&times;</span></button></div>'
				+'<a class="readyMode'+cclass+'" href="#" data-toggle="collapse" data-target="#set'+setL+'Collapse" aria-controls="set'+setL+'Collapse" aria-expanded="true"><div class="collapser">'
				+'<span class="glyphicon glyphicon-chevron-right"></span><span class="glyphicon glyphicon-chevron-down"></span>'
				+'</div></a>'
			+'</div>'
			+'<div id="set'+setL+'Collapse" class="setContainer collapse'+text+'">'
				+'<div class="panel-body">'
					+'<div class="dieContainer panel panel-default col-lg-12 col-sm-12">'+diceHTML+'</div>'
					+'<button id="editDice" class="btn btn-default pull-right readyMode">Edit</button>'
					+'<button id="saveDice" class="btn btn-success pull-right editMode">Save</button>'
					+'<button id="addDice" class="btn btn-default pull-right editMode">Add Die</button>'
				+'</div>'
			+'</div>'
		+'</div>';
}

function spitADHTML(setType, colSize, dieCount, aCount, aType, aBonus) {
	return '<div class="attackDie'+dieCount+' attackDie">'
			+'<div class="panel-body col-lg-'+colSize+' col-sm-'+colSize+' col-xs-'+colSize+' readyMode">'
				+'<span id="ardieCount">'+aCount+'</span> d '
				+'<span id="ardieType">'+aType+'</span> + '
				+'<span id="ariBonus">'+aBonus+'</span>'
			+'</div>'
			+'<div class="panel-body col-lg-'+colSize+' col-sm-'+colSize+' col-xs-'+colSize+' editMode">'
				+'<input id="adieCount" type="text"> d '
				+'<input id="adieType" type="text"> + '
				+'<input id="aiBonus" type="text">'
			+'</div>'
		+'</div>';
}

function spitDDHTML(setType, colSize, dieCount, dCount, dType, diBonus, dtBonus) {
	return '<div class="damageDie'+dieCount+' damageDie clearfix">'
			+'<div class="panel-body col-lg-'+colSize+' col-sm-'+colSize+' col-xs-'+colSize+' readyMode">'
				+'(<span id="rdieCount">'+dCount+'</span> d '
				+'<span id="rdieType">'+dType+'</span> + '
				+'<span id="riBonus">'+diBonus+'</span>) + '
				+'<span id="rtBonus">'+dtBonus+'</span>'
			+'</div>'
			+'<div class="panel-body col-lg-'+colSize+' col-sm-'+colSize+' col-xs-'+colSize+' editMode">'
				+'(<input id="dieCount" type="text"> d '
				+'<input id="dieType" type="text"> + '
				+'<input id="iBonus" type="text">) + '
				+'<input id="tBonus" type="text">'
			+'</div>'
		+'</div>';
}

function spitModBoxHTML(dieCount) {
	return '<div class="modBox editMode">'
			+'<button type="button" id="close'+dieCount+'" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
			//+'<button type="button" class="btn btn-default editAdvanced"><span class="glyphicon glyphicon-cog"></span></button>'
		+'</div>'
		+'<div class="panel-body col-lg-12 col-sm-12 editMode modPanel">'
			+'<div class="col-lg-6 col-sm-6 col-xs-6"></div>'
			+'<div class="col-lg-6 col-sm-6 col-xs-6"></div>'
		+'</div>';
}