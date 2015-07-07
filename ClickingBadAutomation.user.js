// ==UserScript==
// @name       Clicking Bad Automation
// @author     T. Knight
// @version    1.0
// @description  Plays the game for you. Lazy.
// @match      clickingbad.nullism.com
// ==/UserScript==

var Delay = 100;

var sellBtn = document.getElementById("sell_btn");
var makeBtn = document.getElementById("make_btn");
var totalCash = parseNum("sell_amt");
var totalBatch = parseNum("make_amt");
var riskDEA = parseNum("risk_amount");
var riskIRS = parseNum("risk2_amount");
var netBPS = parseNum("clicker_rps");
var grossBPS = parseNum("clicker_rps_g");
var currentCost = 0;
var currentRPS = 0;
var currentEff = 0;
var bestCost = 0;
var bestRPS = 0;
var bestEff = 0;
var bestObj = "";
var arrayType = {};
var tabType = "";

// Manufacturing
var arrayMake = ["01_storage_shed", "03_used_rv", "trailer", "05_house", "07_warehouse", "09_lab", "10_under_lab", "11_bot", "11_bot_s", "under_complex", "country", "12_moon_lab", "station", "meth_factory", "belt", "c_planet", "c_portal"];
var bestMake = "";

// Distribution
var arraySell = ["01_dealer", "03_drug_mule", "drug_van", "cheap_lawyer", "04_club", "05_cartel", "07_dea", "11_city_police", "09_diplomat", "senator", "big_cartel", "dictator", "space_mules", "meth_mart", "shuttle", "s_meth_relay", "s_church"];
var bestSell = "";

// Laundering
var arrayLaundering = ["b_lemonade", "b_nail_salon", "b_banana_stand", "b_chicken_place", "b_laser_tag", "b_car_wash", "b_donations", "b_offshore", "b_nyme", "b_franchise", "b_cantina", "b_resort", "b_spacecorp", "b_tv"];
var bestLaundering = "";

// Upgrades
var arrayUpgrades = ["42_steel_cookware", "32_gas_stove", "33_steel_burner", "43_glass_flasks", "34_titanium_burner", "46_hard_glass_boilers", "02_goatee", "00_air_fresheners", "01_exhaust_fan", "04_glasses", "11_dealer_business_cards", "07_hat", "13_spinning_rims", 
                     "dealer_slacks", "shed_power", "03_hvac", "22_hazmat_suit", "08_mariachi_band", "35_platinum_burner", "47_carbon_filters", "49_diamond_flasks", "mules_1", "dealer_guns", "23_personal_enforcer", "09_vats", "mules_2", "camper_lab", "van_jingle", 
                     "lawyers_sleaze", "u_nyme_1", "better_diplomats", "lawyers_better", "50_platinum_boilers", "lawyers_best", "53_space_hazmat", "personal_snipers", "ancient_methology", "21_portable_generator", "rv_solar", "lawyers_super", "chem_degree", "lawyers_magic",
                     "mech_suit", "methylamine_secret", "u_nyme_2", "u_franchise", "u_cantina", "alien_meth", "u_spacecorp", "better_genetics", "crack_bite", "quantum_meth", "u_holy_meth", "u_angelic", "fearless", "slap_chop", "donator_thanks", "u_trick_or_treat"];

// Main function
setInterval(function() {
	UpdateVars();
	Upgrade();
    Launder();
    Make();
    Sell();
        
    if(totalBatch < (grossBPS*10+10)) {
        //console.log("Making Batches");
        makeBtn.click();
    } else {
        //console.log("Selling batches");
        sellBtn.click();
    }
}, Delay);

function UpdateVars() {
    totalCash = parseNum("sell_amt");
    totalBatch = parseNum("make_amt");
    riskDEA = parseNum("risk_amount");
    riskIRS = parseNum("risk2_amount");
    netBPS = parseNum("clicker_rps");
    grossBPS = parseNum("clicker_rps_g");
}

function parseNum(id) {
    var parsed = 0;
    if(document.getElementById(id).textContent.match(/M$/g)) {
        parsed = parseInt(document.getElementById(id).textContent.replace(/[,$M]/g, "") * 1000000);
    } else if(document.getElementById(id).textContent.match(/B$/g)) {
        parsed = parseInt(document.getElementById(id).textContent.replace(/[,$B]/g, "") * 1000000000);
    } else if(document.getElementById(id).textContent.match(/T$/g)) {
        parsed = parseInt(document.getElementById(id).textContent.replace(/[,$T]/g, "") * 1000000000000);
    } else if(document.getElementById(id).textContent.match(/Q$/g)) {
        parsed = parseInt(document.getElementById(id).textContent.replace(/[,$Q]/g, "") * 1000000000000000);
    } else if(document.getElementById(id).textContent.match(/Qt$/g)) {
        parsed = parseInt(document.getElementById(id).textContent.replace(/[,$Qt]/g, "") * 1000000000000000000);
    } else {
        parsed = parseFloat(document.getElementById(id).textContent.replace(/[,$]/g, ""));
    }

    return parsed;
}

function Launder() {
    if(riskIRS > 30) {
        GetBest("launder");
    }
}

function Make() {
    if(netBPS <= 0) {  
        GetBest("make");
    }
}

function Sell() {
    if(netBPS > 0 && riskDEA < 50) {
        GetBest("sell");
    } else if(riskDEA >= 50) {
        if(totalCash >= parseNum("cheap_lawyer_cst") && document.getElementById("cheap_lawyer").className != "s_div hidden") {
           if(document.getElementById("sellers_tab").className != "tab_active")
                document.getElementById("sellers_tab").click();
            console.log("Reducing DEA Risk, buying lawyer | Cash: $" + totalCash + " / $" + parseNum("cheap_lawyer_cst"));
            document.getElementById("cheap_lawyer_btn").click();
        }
    }
}

function Upgrade() {
    for(var i=0; i<arrayUpgrades.length; i++) {
        if(totalCash >= parseNum(arrayUpgrades[i] + "_cst") && document.getElementById(arrayUpgrades[i]).className != "s_div hidden") {
            if(document.getElementById("upgrades_tab").className != "tab_active")
                document.getElementById("upgrades_tab").click();
            console.log("Buying upgrade: " + arrayUpgrades[i]);
            document.getElementById(arrayUpgrades[i] + "_btn").click();
            break;
        }
    }
}

function GetBest(type) {
    switch (type) {
        case "launder":
            arrayType = arrayLaundering;
            tabType = "banks_tab";
        	break;
        
        case "make":
            arrayType = arrayMake;
            tabType = "clickers_tab";
            break;
            
        case "sell":
            arrayType = arraySell;
            tabType = "sellers_tab";
            break;
    }

    bestCost = parseNum(arrayType[0] + "_cst");
    bestRPS = parseNum(arrayType[0] + "_rps");
    bestEff = bestRPS / bestCost; 
    bestObj = arrayType[0];
    
    for(var i=0; i<arrayType.length; i++) {
        if(document.getElementById(arrayType[i]).className != "s_div hidden") {
            currentCost = parseNum(arrayType[i] + "_cst");
            currentRPS = parseNum(arrayType[i] + "_rps");
            currentEff = currentRPS / currentCost; 
            //document.getElementById(arrayType[i] + "_lbl").textContent = document.getElementById(arrayType[i] + "_lbl").textContent + " | " + currentEff.toString();
            
            if(currentEff > bestEff) {
                bestCost = currentCost;
                bestRPS = currentRPS;
                bestEff = currentEff;
                bestObj = arrayType[i];
            }
        }
    }
    
    document.getElementById(bestObj).style.backgroundColor = 'lightgreen';
    
    if(totalCash > bestCost) {
        if(document.getElementById(tabType).className != "tab_active")
            document.getElementById(tabType).click();
        console.log("Buying " + tabType.substring(0, tabType.length - 5) + ": " + bestObj);
        document.getElementById(bestObj + "_btn").click();
        document.getElementById(bestObj).style.backgroundColor = 'white';
    }
}