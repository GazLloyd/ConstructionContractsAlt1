import * as a1lib from "@alt1/base";
import { ImgRef } from "@alt1/base";
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
	//weirdness with detecting that f
	"can be found southeast of the main square": { name:"Varrock General Store", beds: {s:1,l:0} },
	"can be found southeast o the main square": { name:"Varrock General Store", beds: {s:1,l:0} },

	"can be found south of the varrock estate agent": { name:"Charos", beds: {s:0,l:1} },
	// more weirdness with finding the correct lines
	"can be found on the road leading north from the": { name:"Blue Moon Inn", beds: {s:2,l:1} },
	"can be found on the road": { name:"Blue Moon Inn", beds: {s:2,l:1} },
	"varrock lodestone": { name:"Blue Moon Inn", beds: {s:2,l:1} },

	"can be found west of the lumbridge graveyard": { name:"Bob", beds: {s:0,l:1} },
	"can be found south of the lumbridge lodestone": { name:"Victoria", beds: {s:0,l:1} },
	"can be found outside the lumbridge courtyard": { name:"Father Aereck", beds: {s:0,l:0} },
	"can be found north of the castle": { name:"Lumbridge General Store", beds: {s:1,l:1} },
	"can be found northeast of the bank": { name:"Ned", beds: {s:0,l:1} },
	"can be found northeast o the bank": { name:"Ned", beds: {s:0,l:1} },
	"can be found to the west of the town centre": { name:"Aggie", beds: {s:0,l:1} },
	"an be found to the west the town centre": { name:"Aggie", beds: {s:0,l:1} },
	"head over to any estate gent to pick up a contrac": {name:'', is_complete: true},
	_default: {name:'', beds:{s:0,l:0}}
};

const WHITE = [[255,255,255]];
//const XP_RE = /XP Reward: *([0123456789,]+)/i;
var contract:Contract, settings:Settings, tooltipmanager:TooltipManager;

var is_debug = window.location.pathname === '/gazproj/alt1dev/contracts.html'; 
export function toggleDebug(t: boolean) {
	is_debug = t;
}
function log(...args) {
	if (is_debug) {
		args.forEach(arg => console.log(arg));
	}
}

export function getContract() {
	return contract;
}

//reference the appconfig.json file as config, this file can also be referenced in an alt1 link in any browser
//clicking this link in any browser will start alt1 and show an add app dialog
//<a href="alt1:addapp:http://runeapps.org/apps/alt1/example/appconfig.json">Add example app</a>
//only supported in alt1 1.1+
if(window.alt1 && alt1.versionint>1001000){alt1.identifyAppUrl("contractsconfig.json");}
var bounds = {x: 46, y:102, w:100, h:8};
export function setBoundsTest(x,y,w,h) {
	bounds = { x: x, y:y, h:h, w:w };
}


class Settings {
	autodetect: boolean
	plank: string
	nail: string
	tooltip_bench: boolean
	tooltip_othermats: boolean
	autodetectInterval: number
	tooltipmanager: TooltipManager
	private static self: Settings

	constructor() {
		Settings.self = this;
		var _s = window.localStorage.getItem('construction_contracts');
		var s = JSON.parse(_s);
		s = $.extend({}, this.getDefault(), s);
		this.autodetect = s['autodetect'];
		this.plank = s['plank'];
		this.nail = s['nail'];
		this.tooltip_bench = s['tooltips']['bench'];
		this.tooltip_othermats = s['tooltips']['othermats'];

		$('#autodetect').prop('checked', this.autodetect);
		$('#tooltip_bench').prop('checked', this.tooltip_bench);
		$('#tooltip_othermats').prop('checked', this.tooltip_othermats);
		$('#plankselect').val(this.plank);
		$('#nailsselect').val(this.nail);

		$('#showsettingsbutton').on('click', function(){
			if ($('#settingscontainer').hasClass('settings-hidden')) {
				$('#settingscontainer').removeClass('settings-hidden').addClass('settings-shown');
				$('#showsettingsbutton').text('Hide settings');
			} else {
				$('#settingscontainer').removeClass('settings-shown').addClass('settings-hidden');
				$('#showsettingsbutton').text('Show settings');
			}
		});
		$('#autodetect').on('change', this.toggleAutodetect);
		$('#settings input, #settings select').on('change', this.updateSettings);
		$('#promolinks a').on('click', function(){
			window.open($(this).attr('js_href'), '_blank');
		});
		this.toggleAutodetect();
	}

	toggleAutodetect(): void {
		// using Settings.self as jQuery events override this
		// upon toggle, clear interval anyway to make sure its ok
		window.clearInterval(Settings.self.autodetectInterval);
		if ($('#autodetect').is(':checked')) {
			Settings.self.autodetectInterval = window.setInterval(readContract, 1000);
		}
	}

	updateSettings(): void {
		// using Settings.self as jQuery events override this
		Settings.self.autodetect = $('#autodetect').is(':checked');
		Settings.self.plank = $('#plankselect').val().toString();
		Settings.self.nail = $('#nailsselect').val().toString();
		Settings.self.tooltip_bench = $('#tooltip_bench').is(':checked');
		Settings.self.tooltip_othermats = $('#tooltip_othermats').is(':checked');
		var s = {
			autodetect: Settings.self.autodetect,
			plank: Settings.self.plank,
			nail: Settings.self.nail,
			tooltips: {
				bench: Settings.self.tooltip_bench,
				othermats: Settings.self.tooltip_othermats
			}
		};
		window.localStorage.setItem('construction_contracts', JSON.stringify(s));
		log('Updated settings to:', JSON.stringify(s));
		if (Settings.self.tooltipmanager !== undefined) {
			Settings.self.tooltipmanager.showTooltip();
		}
		
		try {
			getContract().updateCoreMaterials();
			log('PlankSelect2');
		} catch {
			//pass
		}
	}

	getDefault(): object {
		return {
			autodetect: true,
			plank: 'Mahogany plank',
			nail: 'Rune nails',
			tooltips: {
				bench: true,
				othermats: true
			}
		};
	}

	getStatus(type: string): boolean {
		log(this.tooltip_bench, this.tooltip_othermats);
		if (type === 'tooltip_bench') {
			return this.tooltip_bench;
		}
		if (type === 'tooltip_othermats') {
			return this.tooltip_othermats;
		}
		return false;
	}

	setTTMan(t: TooltipManager): void {
		this.tooltipmanager = t;
	}
}

class InterfaceLocation {
	x: number
	y: number

	constructor(x: number, y:number) {
		this.x = x;
		this.y = y;
	}
}

class TooltipManager {
	watching: Array<{
		type: string,
		furniture: Array<Furniture>,
		message: string
	}>
	settings: Settings

	constructor(s: Settings){
		this.settings = s;
		this.reset();
	}

	addWatched(item: {
		type: string,
		furniture: Array<Furniture>,
		message: string
	}): void {
		this.watching.push(item);
		log(this.watching);
	}

	makeTooltip(): string {
		log('Making tooltip string');
		var s = [];
		for (var i = 0; i<this.watching.length; i++) {
			var item = this.watching[i];
			if (this.settings.getStatus(item.type)) {
				var allcomplete = true;
				for (var j = 0; j<item.furniture.length; j++) {
					allcomplete = allcomplete && item.furniture[j].complete;
				}
				if (!allcomplete) {
					s.push(item.message);
				}
			}
		}
		return s.join('\n');
	}

	showTooltip(): void {
		var s = this.makeTooltip();
		log('Tooltip string: ',s);
		if (s === '') {
			log('Clearing tooltip');
			alt1.clearTooltip();
		} else {
			log('Setting tooltip');
			alt1.setTooltip(s);
		}
	}

	reset(): void {
		alt1.clearTooltip();
		this.watching = [];
	}

}

class Furniture {
	name: string
	complete: boolean
	$tag: JQuery
	symbolLoc_relative: InterfaceLocation
	symbolLoc: InterfaceLocation
	contract: Contract
	tooltip: string
	info: object

	constructor(contract: Contract, locOfSymbol: InterfaceLocation) {
		this.contract = contract;
		this.symbolLoc = locOfSymbol;
		this.symbolLoc_relative = new InterfaceLocation(this.symbolLoc.x - this.contract.location.x, this.symbolLoc.y - this.contract.location.y);
		var n = OCR.findReadLine( this.contract.getImgData(), font, WHITE, this.symbolLoc_relative.x+23, this.symbolLoc_relative.y-1, 100, 12 );
		this.name = n.text;
		this.$tag = $('<span>').addClass('furniture-item').text(this.name);
		this.info = con_data[this.name];
		if (this.info['is_bench']) {
			tooltipmanager.addWatched({
				type: 'tooltip_bench',
				furniture: [this],
				message: 'Bench detected, check outside!'
			});
		}
		this.refresh();
	}

	checkSymbol(): void {
		var diff = this.contract.getImgData().getColorDifference(this.symbolLoc_relative.x+7, this.symbolLoc_relative.y+7, 99, 228, 57); //rgb(99,288,57) is green tick
		log(diff);
		if (diff < 200) { //idk if this is a good threshold
			this.complete = true;
		} else {
			this.complete = false;
		}
	}

	refresh(): void {
		this.checkSymbol();
		if (this.complete) {
			this.$tag.addClass('furniture-complete');
		} else {
			this.$tag.removeClass('furniture-complete');
		}
	}
	markDone(): void {
		this.complete = true;
		this.$tag.addClass('furniture-complete');
	}

	overlayRect(dur: number): void {
		var col = this.complete ? a1lib.mixColor(99, 228, 57) : a1lib.mixColor(227,7,4);
		window.alt1.overLayRect(col, this.symbolLoc.x, this.symbolLoc.y, 11,9, dur, 1);
		window.alt1.overLayRect(col, this.symbolLoc.x+23, this.symbolLoc.y-1, 100,12, dur, 1);
	}
}

class Contract {
	location: InterfaceLocation
	furniture: Array<Furniture>
	npc: {name:string, beds:{s:number, l:number}, check_wom?:boolean, is_complete?:boolean}
	npclocation: {w:number,h:number,x:number,y:number}
	bind: ImgRef
	symbolLocations: Array<InterfaceLocation>
	iscomplete: boolean
	ispaste: boolean
	$xp: JQuery
	notplankxp: number = 0
	planks: number = 0
	largebeds: number = 0
	foundnpc: boolean
	
	private static self: Contract;

	constructor(img: ImgRef) {
		Contract.self = this;
		this.furniture = [];
		this.symbolLocations = [];
		this.iscomplete = false;
		this.ispaste = img === null;
		this.npc = location_map._default;
		this.findContractLocation(img);
	}

	getImgData(): ImageData {
		if (!this.ispaste) {
			return this.bind.toData();
		} else {
			return this.bind.toData(this.location.x, this.location.y, 153, 231);
		}
	}

	findContractLocation(img: ImgRef): void {
		if (img === null) {
			this.ispaste = false
			img = a1lib.captureHoldFullRs();
		} else {
			this.ispaste = true
		}
		this.iscomplete = false;
		// find Xs and ticks
		this.symbolLocations = [];
		var redXloc = img.findSubimage(imgs.redX);
		var greenTickloc = img.findSubimage(imgs.greenTick);
		
		// if we found none, look for 'Contract complete'
		if (redXloc.length + greenTickloc.length === 0) {
			var complete_loc = img.findSubimage(imgs.complete);
			// didn't find it, look for it in legacy
			if (complete_loc.length <= 0) {
				complete_loc = img.findSubimage(imgs.complete_legacy);
			}
			// found it nowhere
			if (complete_loc.length <= 0) {
				this.location = null;
			} else {
				this.location = new InterfaceLocation(complete_loc[0].x-13, complete_loc[0].y-5);
				for (var i=0; i<5; i++) {
					this.symbolLocations.push(new InterfaceLocation(this.location.x+8, this.location.y+87+(i*26)));
				}
				this.iscomplete = true;
			}
		} else {
			if (redXloc.length < 5 && greenTickloc.length > 0) {
				for (var i=0;i<greenTickloc.length;i++) {
					redXloc.push(greenTickloc[i]);
				}
			}
			redXloc.sort((a,b) => a.y-b.y); // sort locations by y value, ascending
			var topSymbol = redXloc[0];
			this.location = new InterfaceLocation(topSymbol.x-8, topSymbol.y-87);
			for (var i=0; i<redXloc.length; i++) {
				this.symbolLocations.push(new InterfaceLocation(redXloc[i].x, redXloc[i].y));
			}
		}
		if (this.location === null) {
			$('#output').addClass('cantfindcontract');
			return;
		}
		$('#output').removeClass('cantfindcontract');
		this.bind = img;
		this.npc = location_map._default;
		this.reloadContract();
		this.showContractRect();
	}

	readNPC(): {name:string, beds:{s:number, l:number}, check_wom?:boolean, is_complete?:boolean} {
		this.foundnpc = false;
		this.bind = a1lib.captureHold(this.location.x, this.location.y, 153, 231);
		this.iscomplete = false;
		var x = 10, y = 46, w = 100, h = 8;
		//alt1.overLayRect(-1, this.location.x+x, this.location.y+y, w, h, 10000, 1);
		//alt1.overLayRect(-1, this.location.x+x+10, this.location.y+y+14, w, h, 10000, 1);
		var _ocr = [
			OCR.findReadLine(this.getImgData(), font, WHITE, x, y, w, h),
			OCR.findReadLine(this.getImgData(), font, WHITE, x+10, y+14, w, h)
		];
		this.npclocation = _ocr[0].debugArea;
		log(_ocr);
		var ocr = _ocr[0].text + ' ' + _ocr[1].text;
		ocr = ocr.replace('.', '').replace('  ', ' ').toLowerCase().trim();
		log(ocr);
		var n = location_map[ocr];
		if (n === undefined) {
			return location_map._default;
		}
		if (n.is_complete) {
			this.iscomplete = true;
		}
		if (n.check_wom) {
			var sub = this.bind.findSubimage(imgs.draynor);
			if (sub.length <= 0) {
				sub = this.bind.findSubimage(imgs.draynor_legacy);
			}
			if (sub.length <= 0) {
				n = location_map['IS_NOT_WOM'];
			} else {
				n = location_map['IS_WOM'];
			}
		}
		log(n);
		this.foundnpc = true;
		return n;
	}

	reloadContract(): void {
		if (this.location === null) {
			return;
		}
		var n = this.readNPC();
		if (this.iscomplete) {
			$('#output').addClass('contract-complete');
		} else {
			$('#output').removeClass('contract-complete');
		}
		if (this.npc['name'] === n['name']) {
			for (var i=0; i<this.furniture.length; i++) {
				this.furniture[i].refresh();
			}
		} else if (this.iscomplete) {
			for (var i=0; i<this.furniture.length; i++) {
				this.furniture[i].markDone();
			}
		} else {
			this.npc = n;
			if (!this.foundnpc) {
				this.findContractLocation(null);
			}
			this.furniture = [];
			tooltipmanager.reset();
			for (var i=0; i<this.symbolLocations.length; i++) {
				this.furniture.push(new Furniture(this, this.symbolLocations[i]));
			}
			this.makeOutput();
		}
		tooltipmanager.showTooltip()
	}

	showContractRect(): void {
		if (this.location === null) return;
		var duration = 5000; //ms
		window.alt1.overLayClearGroup('constructioncontract');
		window.alt1.overLaySetGroup('constructioncontract');
		window.alt1.overLayFreezeGroup('constructioncontract');
		window.alt1.overLayRect(-1, this.location.x, this.location.y, 153, 231, duration, 1); //-1 = solid white
		for (var i=0; i<this.furniture.length; i++) {
			this.furniture[i].overlayRect(duration);
		}
		alt1.overLayRect(a1lib.mixColor(100,0,100), this.location.x+this.npclocation.x, this.location.y+this.npclocation.y, this.npclocation.w, this.npclocation.h, 5000, 1);
		alt1.overLayRect(a1lib.mixColor(100,0,100), this.location.x+this.npclocation.x, this.location.y+this.npclocation.y, this.npclocation.w, this.npclocation.h, 5000, 1);
		window.alt1.overLayRefreshGroup('constructioncontract');
	}

	makeOutput(): void {
		var nails = 0, additional = {}, additional_names = [], xp = 0, othermats = {}, furnnames = [];
		this.planks = 0;
		this.largebeds = 0;
		var $furn = $('<div>').append('Detected furniture: ');
		// gather needed materials
		for (var i = 0; i<this.furniture.length; i++) {
			var furn = this.furniture[i], furninfo = furn.info;
			$furn.append(furn.$tag);
			furnnames.push(furn.name);
			this.planks += furninfo['planks'];
			nails += furninfo['nails'];
			if (furninfo.hasOwnProperty('additional')) {
				for (var j=0; j<furninfo['additional'].length; j++) {
					var addm = furninfo['additional'][j], matname = addm['mat'];
					if (addm['is_stove_bar']) {
						if (stove_map.hasOwnProperty(settings.plank)) {
							matname = stove_map[settings.plank]
						}
					}
					if (addm['is_bed']) {
						if (this.npc.beds.l > this.largebeds) {
							this.largebeds++;
						} else {
							addm = con_data['Bed (small)'];
						}
					}
					if (additional.hasOwnProperty(matname)) {
						additional[matname] += addm['qty'];
					} else {
						additional[matname] = addm['qty'];
						additional_names.push(matname);
					}
					if (matname !== 'White candle' && matname !== 'Bolt of cloth') {
						if (othermats.hasOwnProperty(matname)) {
							othermats[matname].push(furn);
						} else {
							othermats[matname] = [furn];
						}
					}
				}
			}
		}
		additional_names.sort();

		var $output = $('#output');
		var $table = $('<table id="outputtable">');

		$table.append(
			$('<tr>').append(
				$('<th>').attr('colspan', 2).text('Material'),
				$('<th>').text('Number')
			),
			$('<tr id="plankrow">').append(
				$('<td class="imgcell">').append($('<img>').attr('src', src_imgs[settings.plank].default)),
				$('<td class="namecell">').text(settings.plank),
				$('<td class="qtycell">').text(this.planks)
			),
			$('<tr id="nailsrow">').append(
				$('<td class="imgcell">').append($('<img>').attr('src', src_imgs[settings.nail].default)),
				$('<td class="namecell">').text(settings.nail),
				$('<td class="qtycell">').text(nails)
			)
		);
		//xp += xp_each[settings.plank] * planks;
		for (var i = 0; i<additional_names.length; i++) {
			var n = additional_names[i], qty = additional[n];
			$table.append(
				$('<tr>').append(
					$('<td class="imgcell">').append($('<img>').attr('src', src_imgs[n].default)),
					$('<td class="namecell">').text(n),
					$('<td class="qtycell">').text(qty)
				)
			)
			if (othermats.hasOwnProperty(n)) {
				tooltipmanager.addWatched({
					type: 'tooltip_othermats',
					furniture: othermats[n],
					message: 'Bring '+qty+' '+n
				});
			}
			xp += xp_each[n] * qty;
		}
		var $map = $('<div id="outputlocation">');
		$map.append(
			$('<div id="npcname">').text(this.npc['name']),
			$('<div id="npcmap">').append(
				$('<img>').attr('src', src_imgs[this.npc['name']].default)
			)
		);
		xp += 15;
		this.notplankxp = xp;
		this.$xp = $('<div id="xpoutput">');
		this.updateXP();


		$output.empty().append($furn, $table, this.$xp, $map);
		$.post('https://chisel.weirdgloop.org/gazproj/alt1/contracts/data', JSON.stringify({location: this.npc['name'], furniture: furnnames}));
	}
	updateCoreMaterials(): void {
		$('#plankrow .imgcell img').attr('src', src_imgs[settings.plank].default);
		$('#plankrow .namecell').text(settings.plank);
		$('#nailsrow .imgcell img').attr('src', src_imgs[settings.nail].default);
		$('#nailsrow .namecell').text(settings.nail);
		// jQuery event this overwrites
		Contract.self.updateXP();
	}
	updateXP(): void {
		var bonusxp = xp_bonus_from_planks[settings.plank], plankxp = xp_each[settings.plank] * this.planks;
		Contract.self.$xp.empty().append('<strong>Total XP:</strong> ', (this.notplankxp+plankxp+bonusxp+10000).toLocaleString()).attr('title', 'XP from materials: '+(this.notplankxp+plankxp).toLocaleString()+'\nContract reward: 10,000\nBonus reward from planks: '+bonusxp.toLocaleString());
	}
	
}

export function readContract() {
	if(!window.alt1){
		$('#output').empty().append("You're using this in a browser");
		return;
	}
	if (contract === undefined || contract.location === null) {
		contract = null;
		contract = new Contract(null);
	} else {
		contract.reloadContract();
	}
}

export function makeNewContract() {
	contract = new Contract(null);
}

export function getJQuery() {
	return $;
}

export function start(){
	if(window.alt1){
		//dump all events onto the console (right-click the settings spanner to view)
		for (var a in alt1.events) {
			alt1.events[a].push(function (e) { console.log(e); });
		}
	} else {
		$('body').addClass('noalt1');
		$('#output').before($('<div id="browserwarning">').append('This app is better in Alt1. Please open it in the Alt1 browser, or ', $('<a id="openinalt1">').attr('href', 'alt1://addapp/'+window.location.href.replace('contracts.html', 'contractsconfig.json')).text('click here'),'.<br>You can paste images into here for the same result, if you like.'));
		if (is_debug) {
			$('#browserwarning').append('\n<br><b><big>This is the development version. Be aware that it may break at any time when in active development. See <a href="https://chisel.weirdgloop.org/gazproj/alt1/contracts.html">here</a> for the stable release.</big></b>');
		}
		a1lib.PasteInput.listen(function(imgref){
			contract = new Contract(imgref);
		}, function(mes, err){console.log(mes, err)}, false);
	}
	settings = new Settings();
	tooltipmanager = new TooltipManager(settings);
	settings.setTTMan(tooltipmanager);
	

	//$('#settings input').on('change', saveSettings);
	if (window.location.pathname === '/gazproj/alt1dev/contracts.html') {
		$('#readcontractbutton').text('Dev Version');
	}
}