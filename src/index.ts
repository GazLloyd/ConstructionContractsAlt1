import * as a1lib from "@alt1/base";
import * as OCR from "@alt1/ocr";
import * as $ from "jquery"; 
const font = require("@alt1/ocr/fonts/aa_8px_new.fontmeta.json");
//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./contracts.html");
require("!file-loader?name=[name].[ext]!./contractsconfig.json");

//loads all images as raw pixel data async, images have to be saved as *.data.png
//this also takes care of srgb header bullshit
//this is async to cant acccess them instantly but generally takes <20ms
var imgs = a1lib.ImageDetect.webpackImages({
	contracttop: require("./contracttop.data.png"),
	redX: require("./redX.data.png"),
	greenTick: require("./greenTick.data.png"),
	draynor: require("./draynor.data.png"),
	draynor_legacy: require("./draynor_legacy.data.png"),
	complete: require("./complete.data.png"),
	complete_legacy: require("./complete_legacy.data.png"),
});

const src_imgs = {
	"Plank": require("./Plank.png"),
	"Oak plank": require("./Oak plank.png"),
	"Teak plank": require("./Teak plank.png"),
	"Mahogany plank": require("./Mahogany plank.png"),
	"Protean plank": require("./Protean plank.png"),
	"Bronze nails": require("./Bronze nails.png"),
	"Iron nails": require("./Iron nails.png"),
	"Steel nails": require("./Steel nails.png"),
	"Black nails": require("./Black nails.png"),
	"Mithril nails": require("./Mithril nails.png"),
	"Adamant nails": require("./Adamant nails.png"),
	"Rune nails": require("./Rune nails.png"),
	"White candle":  require("./White candle.png"),
	"Bolt of cloth": require("./Bolt of cloth.png"),
	"Iron bar": require("./Iron bar.png"),
	"Steel bar": require("./Steel bar.png"),
	"Mithril bar": require("./Mithril bar.png"),
	"Adamant bar": require("./Adamant bar.png"),

	"Edgeville General Store": require("./Edgeville General Store.png"),
	"Lumbridge General Store": require("./Lumbridge General Store.png"),
	"Bob": require("./Bob.png"),
	"Victoria": require("./Victoria.png"),
	"Father Aereck": require("./Father Aereck.png"),
	"Charos": require("./Charos.png"),
	"Blue Moon Inn": require("./Blue Moon Inn.png"),
	"Varrock General Store": require("./Varrock General Store.png"),
	"Wise Old Man": require("./Wise Old Man.png"),
	"Aggie": require("./Aggie.png"),
	"Ned": require("./Ned.png"),
};

const con_data = {
	"Chair":{"nails":4,"planks":5},
	"Stand":{"nails":4,"planks":3,"additional":[{"mat":"White candle","qty":1}]},
	"Drawers":{"nails":2,"planks":4},
	"Stove":{"nails":4,"planks":2,"is_stove":true,"additional":[{"mat":"Metal bar","qty":2, "is_stove_bar": true}]},
	"Stool":{"nails":4,"planks":4},
	"Desk":{"nails":2,"planks":8},
	"Organ":{"nails":4,"planks":12,"additional":[{"mat":"Steel bar","qty":4}]},
	"Wardrobe":{"nails":4,"planks":8},
	"Chest":{"nails":2,"planks":4},
	"Wheel":{"nails":2,"planks":2},
	"Shelf":{"nails":2,"planks":4},
	"Ladder":{"nails":4,"planks":5},
	"Portrait":{"nails":2,"planks":2},
	"Counter":{"nails":4,"planks":6},
	"Altar":{"nails":4,"planks":10,"additional":[{"mat":"White candle","qty":2},{"mat":"Bolt of cloth","qty":1}]},
	"Pew":{"nails":4,"planks":5},
	"Table":{"nails":4,"planks":6},
	"Votary":{"nails":4,"planks":3,"additional":[{"mat":"White candle","qty":1}]},
	"Sink":{"nails":4,"planks":4,"additional":[{"mat":"Steel bar","qty":2}]},
	"Bench":{"nails":4,"planks":5, "is_bench": true},
	"Shelves":{"nails":4,"planks":6},
	"Lighting":{"nails":4,"planks":2,"additional":[{"mat":"White candle","qty":1}]},
	"Bookcase":{"nails":4,"planks":8},
	"Bed":{"nails":4,"planks":10,"additional":[{"mat":"Bolt of cloth","qty":2}], is_bed:true},
	"Bed (small)":{"nails":2,"planks":8,"additional":[{"mat":"Bolt of cloth","qty":1}], is_bed:true}
};

const stove_map = {
	"Plank": "Iron bar",
	"Oak plank": "Steel bar",
	"Teak plank": "Mithril bar",
	"Mahogany plank": "Adamant bar",
	"Protean plank": "Adamant bar"
};

const xp_each = {
	"Plank": 28,
	"Oak plank": 60,
	"Teak plank": 90, 
	"Mahogany plank": 140,
	"Protean plank": 140,
	"Bronze nails": 0,
	"Iron nails": 0,
	"Steel nails": 0,
	"Black nails": 0,
	"Mithril nails": 0,
	"Adamant nails": 0,
	"Rune nails": 0,
	"White candle":  5,
	"Bolt of cloth": 15,
	"Iron bar": 10,
	"Steel bar": 20,
	"Mithril bar": 10,
	"Adamant bar": 10
};
const xp_bonus_from_planks = {
	Plank: 0,
	'Oak plank': 1000,
	'Teak plank': 2000,
	'Mahogany plank': 5000,
	'Protean plank': 5000
};

const location_map = {
	"can be found north of the bank": { check_wom: true },
	"IS_WOM": { name:"Wise Old Man", beds: {s:0,l:0} },
	"IS_NOT_WOM": { name:"Edgeville General Store", beds: {s:1,l:1} },
	"can be found southeast of the main square": { name:"Varrock General Store", beds: {s:1,l:0} },
	"can be found south of the varrock estate agent": { name:"Charos", beds: {s:0,l:1} },
	"can be found on the road leading north from the": { name:"Blue Moon Inn", beds: {s:2,l:1} },
	"varrock lodestone": { name:"Blue Moon Inn", beds: {s:2,l:1} },
	"can be found west of the lumbridge graveyard": { name:"Bob", beds: {s:0,l:1} },
	"can be found south of the lumbridge lodestone": { name:"Victoria", beds: {s:0,l:1} },
	"can be found outside the lumbridge courtyard": { name:"Father Aereck", beds: {s:0,l:0} },
	"can be found north of the castle": { name:"Lumbridge General Store", beds: {s:1,l:1} },
	"can be found northeast of the bank": { name:"Ned", beds: {s:0,l:1} },
	"can be found to the west of the town centre": { name:"Aggie", beds: {s:0,l:1} }

};

const WHITE = [[255,255,255]];
const XP_RE = /XP Reward: *([0123456789,]+)/i;

//reference the appconfig.json file as config, this file can also be referenced in an alt1 link in any browser
//clicking this link in any browser will start alt1 and show an add app dialog
//<a href="alt1:addapp:http://runeapps.org/apps/alt1/example/appconfig.json">Add example app</a>
//only supported in alt1 1.1+
if(window.alt1 && alt1.versionint>1001000){alt1.identifyAppUrl("contractsconfig.json");}
var bounds = {x: 46, y:102, w:100, h:8};
export function setBoundsTest(x,y,w,h) {
	bounds = { x: x, y:y, h:h, w:w };
}

var last_output = '';

export function setTooltip(txt) {
	if (!window.alt1) {
		return;
	}
	if (txt == '') {
		window.alt1.clearTooltip();
	}
	window.alt1.setTooltip(txt);
}

function saveSettings() {
	var setts = {
		plank: $('#plankselect').val().toString(),
		nail: $('#nailsselect').val().toString(),
		autodetect: $('#autodetect').is(':checked'),
		tooltip: {
			othermats: $('#tooltip_othermats').is(':checked'),
			bench: $('#tooltip_bench').is(':checked')
		}
	};
	localStorage.setItem('construction_contracts', JSON.stringify(setts));
}

export function findContract() {
	return _findContract(a1lib.captureHoldFullRs());
}

export function _findContract(img) {
	var redXloc = img.findSubimage(imgs.redX);
	var greenTickloc = img.findSubimage(imgs.greenTick);
	console.log('redXloc', redXloc);
	console.log('greenTickloc', greenTickloc);
	if (redXloc.length + greenTickloc.length === 0) {
		var complete_loc = img.findSubimage(imgs.complete);
		if (complete_loc.length < 0) {
			complete_loc = img.findSubimage(imgs.complete_legacy);
		}
		if (complete_loc.length < 0) {
			return {found: false};
		}
		return {found:true, complete:true}
	}
	if (redXloc.length < 5 && greenTickloc.length > 0) {
		for (var i=0;i<greenTickloc.length;i++) {
			redXloc.push(greenTickloc[i]);
		}
	}
	redXloc.sort((a,b) => a.y-b.y); // sort locations by y value, ascending
	// don't think this is used many other places but check that you can't have many of them on screen at once
	if (redXloc.length > 5) {
		console.log('Found more than 5 X/tick locations!!');
	}
	var locOut = { x: redXloc[0].x-21, y: redXloc[0].y-101 };
	console.log(locOut);

	return { found:true, complete:false, img: img, loc: locOut };
}

export function readContractText(_img) {
	var img = _img.img;
	var loc = _img.loc;
	var buf = img.toData(loc.x,loc.y,206,269);
	var txt_arr = [
		OCR.findReadLine(buf, font, WHITE, bounds.x, bounds.y, bounds.w, bounds.h),
		OCR.findReadLine(buf, font, WHITE, bounds.x, bounds.y+25, bounds.w, bounds.h),
		OCR.findReadLine(buf, font, WHITE, bounds.x, bounds.y+51, bounds.w, bounds.h),
		OCR.findReadLine(buf, font, WHITE, bounds.x, bounds.y+77, bounds.w, bounds.h),
		OCR.findReadLine(buf, font, WHITE, bounds.x, bounds.y+103, bounds.w, bounds.h),
	];
	var txt_location = [
		OCR.findReadLine(buf, font, WHITE, 20, 64, 100, 8),
		OCR.findReadLine(buf, font, WHITE, 20, 77, 100, 8),
	];
	var txt_furniture = [], txt_lower=[];
	for (var i=0; i<txt_arr.length; i++) {
		var txt = txt_arr[i].text;
		txt_furniture.push(txt);
		txt_lower.push(txt.toLowerCase());
	}
	console.log('txt_location', txt_location);
	var txt_loc_str = txt_location[0].text + ' ' + txt_location[1].text;
	txt_loc_str = txt_loc_str.toLowerCase().replace('.', '').trim();
	console.log('txt_loc_str', txt_loc_str);
	var location_info = location_map[txt_loc_str];
	if (location_info.check_wom) {
		var found;
		if (txt_lower.includes('shelf') || txt_lower.includes('shelves') || txt_lower.includes('drawers')) {
			found = 'IS_NOT_WOM';
		} else if (txt_lower.includes('bookcase') || txt_lower.includes('bench')) {
			found = 'IS_WOM';
		} else {
			var dray_loc = img.findSubimage(imgs.draynor);
			if (dray_loc.length == 0) {
				found = 'IS_NOT_WOM';
			} else {
				dray_loc = img.findSubimage(imgs.draynor_legacy);
				if (dray_loc.length == 0) {
					found = 'IS_NOT_WOM';
				} else {
					found = 'IS_WOM';
				}
			}
		}
		location_info = location_map[found];
	}

	var xp_txt = OCR.findReadLine(buf, font, WHITE, bounds.x-7, bounds.y+103+27, bounds.w, bounds.h);
	var xp_reward = 10000;
	console.log('txt_arr', JSON.stringify(txt_arr));
	console.log('xp_txt', JSON.stringify(xp_txt));
	if (XP_RE.test(xp_txt.text)) {
		var mt = XP_RE.exec(xp_txt.text);
		var _xp = mt[1];
		_xp = _xp.replace(/,/g, '');
		var __xp = parseInt(_xp);
		if (!isNaN(__xp)) {
			xp_reward = __xp;
		}
	}

	return { txt: txt_furniture, xp: xp_reward, location: location_info };
}

export function makeOutput(furniture, xp_reward, location) {
	if (!window.alt1) {
		//return;
	}
	var plank = $('#plankselect').val().toString();
	var nail = $('#nailsselect').val().toString();
	saveSettings();
	var totals = {planks:0, nails:0, additional: {}, _additional_names: [], names:[]};
	var has_bench = false;
	var large_beds = 0;
	for (var i = 0; i<5; i++) {
		totals.names.push(furniture[i]);
		if (furniture[i] !== "") {
			var info = con_data[furniture[i]];
			// bed check
			if (info.is_bed) {
				if (location.beds.l <= large_beds && (location.beds.l+location.beds.s)>0) {
					// if we've counted the number large beds in the location (or more, somehow), AND the number of beds in the location > 0, we should do this as a small bed
					info = con_data['Bed (small)'];
				} else {
					// add a large bed if we have less large beds than the total large beds at the location
					// OR if there are no recorded beds for the location (somehow)
					large_beds++;
				}
			}
			has_bench = has_bench || info.is_bench;
			totals.planks += info.planks;
			totals.nails += info.nails;
			if (info.hasOwnProperty('additional')) {
				for (var j=0; j<info.additional.length; j++) {
					var mat = info.additional[j].mat;
					if (info.additional[j].is_stove_bar) {
						mat = stove_map[plank];
					}
					if (totals.additional.hasOwnProperty(mat)) {
						totals.additional[mat] += info.additional[j].qty;
					} else {
						totals.additional[mat] = info.additional[j].qty;
						totals._additional_names.push(mat);
					}
				}
			}
		}
	}
	totals._additional_names.sort();
	console.log(JSON.stringify(totals)+"\n"+plank+"\n"+nail);
	var tooltip = [];
	var xp_mats = 15;
	var $table = $('<table id="outputtable">');
	$table.append($('<tr>').append('<th colspan="2">Item</th>', '<th>Needed</th>'))
		.append($('<tr>').append(
			$('<td>').append($('<img>').attr('src', src_imgs[plank].default)),
			$('<td>').append(plank),
			$('<td>').append(totals.planks.toString())
		))
		.append($('<tr>').append(
			$('<td>').append($('<img>').attr('src', src_imgs[nail].default)),
			$('<td>').append(nail),
			$('<td>').append(totals.nails.toString())
		));

	xp_mats += xp_each[nail] * totals.nails + xp_each[plank] * totals.planks;

	for (var i = 0; i < totals._additional_names.length; i++) {
		var matname = totals._additional_names[i];
		$table.append($('<tr>').append(
			$('<td>').append($('<img>').attr('src', src_imgs[matname].default)),
			$('<td>').append(matname),
			$('<td>').append(totals.additional[matname].toString())
		));
		xp_mats +=  xp_each[matname] * totals.additional[matname];
		if ($('#tooltip_othermats').is(':checked') && matname !== 'White candle' && matname !== 'Bolt of cloth') {
			tooltip.push('Bring '+totals.additional[matname]+' '+matname);
		}
	}
	var xp_bonus_reward = xp_bonus_from_planks[plank];
	var location_tag = $('<div id="outputlocation">');
	if (location === undefined) {
		location_tag.append('Failed to find location');
	} else {
		location_tag.append(location.name);
		if (has_bench) {
			location_tag.append('<br><span class="benchdetected">Bench detected! Check outside!</span>');
			if ($('#tooltip_bench').is(':checked')) {
				tooltip.push('Bench detected!');
			}
		}
		location_tag.append('<br>', $('<img>').attr('src', src_imgs[location.name].default));
	}
	$('#output').empty().append(
		$('<div id="outputfurn">').append('Detected furniture: ', totals.names.join(', ')),
		$table,
		$('<div id="outputxp">').append('XP from materials: ', xp_mats.toLocaleString(), '<br>XP reward: ',xp_reward.toLocaleString(), '<br>Bonus reward: ',xp_bonus_reward.toLocaleString(), '<br><b>Total XP: ', (xp_mats+xp_reward+xp_bonus_reward).toLocaleString() ,'</b>'),
		location_tag
	);
	if (tooltip.length > 0) {
		console.log('Setting tooltip: ', tooltip);
		setTooltip(tooltip.join('\n'));
	} else {
		console.log('Clearing tooltip');
		setTooltip('');
	}
	$.post('https://chisel.weirdgloop.org/gazproj/alt1/contracts/data', JSON.stringify({location: location.name, furniture: totals.names}));
}

export function readContract() {
	if(!window.alt1){
		$('#output').empty().append("You're using this in a browser");
	}
	var _img = findContract();
	if (!_img.found) {
		$('#output').empty().append('Failed to find contract interface. Make sure it is open and not obscured, and try again.');
		setTooltip('');
		last_output = null;
		return;
	}
	if (_img.complete) {
		$('#output').empty().append('Contract complete!');
		setTooltip('');
		last_output = null;
		return;
	}
	var ctr_txt = readContractText(_img);
	if (JSON.stringify(ctr_txt) !== last_output) {
		makeOutput(ctr_txt.txt, ctr_txt.xp, ctr_txt.location);
		last_output = JSON.stringify(ctr_txt);
	}
}

export function readContractAnyway() {
	var _img = findContract();
	if (!_img.found) {
		$('#output').empty().append('Failed to find contract interface. Make sure it is open and not obscured, and try again.');
		setTooltip('');
		last_output = null;
		return;
	}
	if (_img.complete) {
		$('#output').empty().append('Contract complete!');
		setTooltip('');
		last_output = null;
		return;
	}
	var ctr_txt = readContractText(_img);
	makeOutput(ctr_txt.txt, ctr_txt.xp, ctr_txt.location);
	last_output = JSON.stringify(ctr_txt);
}


function readContractPasted(imgref){
	console.log('Image pasted')
	var _img = _findContract(imgref);
	if (!_img.found) {
		$('#output').empty().append('Failed to find contract interface. Make sure it is open and not obscured, and try again.');
		last_output = null;
		return;
	}
	if (_img.complete) {
		$('#output').empty().append('Contract complete!');
		setTooltip('');
		last_output = null;
		return;
	}
	var ctr_txt = readContractText(_img);
	makeOutput(ctr_txt.txt, ctr_txt.xp, ctr_txt.location);
	last_output = JSON.stringify(ctr_txt);
}

export function start(){
	if(window.alt1){
		if(alt1.permissionInstalled) {
			console.log(JSON.parse(alt1.openInfo));
		}
		//dump all events onto the console (right-click the settings spanner to view)
		for (var a in alt1.events) {
			alt1.events[a].push(function (e) { console.log(e); });
		}
	} else {
		$('body').addClass('noalt1');
		$('#output').before($('<div id="browserwarning">').append('This app is better in Alt1. Please open it in the Alt1 browser, or ', $('<a id="openinalt1">').attr('href', 'alt1://addapp/'+window.location.href).text('click here'),'.<br>You can paste images into here for the same result, if you like.'));
		if (window.location.pathname === '/gazproj/alt1dev/contracts.html') {
			$('#browserwarning').append('\n<br><b><big>This is the development version. Be aware that it may break at any time when in active development. See <a href="https://chisel.weirdgloop.org/gazproj/alt1/contracts.html">here</a> for the stable release.</big></b>');
		}
		a1lib.PasteInput.listen(readContractPasted, function(mes, err){console.log(mes, err)}, false);
	}

	$('#showsettingsbutton').on('click', function(){
		if ($('#settingscontainer').hasClass('settings-hidden')) {
			$('#settingscontainer').removeClass('settings-hidden').addClass('settings-shown');
			$('#showsettingsbutton').text('Hide settings');
		} else {
			$('#settingscontainer').removeClass('settings-shown').addClass('settings-hidden');
			$('#showsettingsbutton').text('Show settings');
		}
	});

	var setts = localStorage.getItem('construction_contracts'), _setts;
	if (setts === null) {
		_setts = { nail: 'Rune nails', plank: 'Mahogany plank', autodetect: false, tooltip: { bench: true, othermats: true }};
	} else {
		_setts = JSON.parse(setts);
		_setts = $.extend(true, {}, { nail: 'Rune nails', plank: 'Mahogany plank', autodetect: false, tooltip: { bench: true, othermats: true }}, _setts);
	}
	$('#nailsselect').val(_setts.nail);
	$('#plankselect').val(_setts.plank);
	$('#autodetect').prop('checked', _setts.autodetect);
	$('#tooltip_othermats').prop('checked', _setts.tooltip.othermats);
	$('#tooltip_bench').prop('checked', _setts.tooltip.bench);

	$('#nailsselect, #plankselect').on('change', readContractAnyway);

	var autodetect_interval;
	$('#autodetect').on('change', function(){
		if ($('#autodetect').is(':checked')) {
			autodetect_interval = setInterval(readContract, 2000);
		} else {
			clearInterval(autodetect_interval);
		}
	});

	$('#settings input').on('change', saveSettings);
	if (window.location.pathname === '/gazproj/alt1dev/contracts.html') {
		$('#readcontractbutton').text('Dev Version');
	}
}