$( function() {
    initHandlers();
    initGame();
});

function initGame() {
    initPlayer();
    initMonsters();

}

function beginHunt() {
    huntActive = true;
}

function initPlayer() {
    //resets player variables before weapon selection and such
    var pr = playerBlock;
    pr.currentHP = pr.maxHP;
    pr.attack = 0;
    pr.accuracy = 1.0;
    pr.defense = 0;
    pr.evasion = 0.0;
    pr.weaponSwap(playerBlock.weapons.swordShield); //defaults to this in case the player just doesn't click anything before submit
    potionsRemaining = 3;
    monstersDefeated = [];
    monsterTarget = monsterJagras;
    updateHealthDisplay(playerBlock);
}

function initMonsters() {
    //Resets all monster's currentHP to max, makes it active
    var monsterArray = [monsterJagras, monsterAnjanath, monsterRathian];
    for (i = 0; i < monsterArray.length; i++) {
        var mrI = monsterArray[i];
        mrI.currentHP = mrI.maxHP;
        $(mrI.intermissionId).removeClass("disabled");
    }
    monsterIsActive = true;

    //removes the big X over monster's icons, in case starting over without refresh
    $(".floating-x").remove();
    updateHealthDisplay(monsterJagras);
    
}

//Character setup
var playerBlock = {
    name: "Hunter",
    type: "player", 
    attack: 0,
    attackBoost: 0,
    defenseBoost: 0,
    accuracy: 1.0,
    counterAttack: 0, 
    defense: 0, 
    evasion: 0.0,
    weapon: "none",
    weaponImage: "",
    maxHP: 100,
    currentHP: 100,
    verbs: ["pulverise", "defenestrate", "sock", "crump", "swinge", "wallop", "smite", "assault", "clobber", "thrash", "spank", "abuse"],
    bodyParts: ["bung", "spine", "finger", "ulna", "pelvis", "duodenum", "epiglottis", "face", "pinky toe", "solar plexus", "funnybone", "cuticles", "ear", "eyebrow", "knee", "clavicle", "kidney", "cockles"],
    description: "You, person crazy enough to fight dinosaurs and dragons with a sword.",
    //This will change all the player's stats to the ones defined by the weapon selected
    weaponSwap : function(clickedWeapon) {
        this.attack = clickedWeapon.attack;
        this.defense = clickedWeapon.defense;
        this.accuracy = clickedWeapon.accuracy;
        this.weapon = clickedWeapon.name;
        this.evasion = clickedWeapon.evasion;
        this.attackBoost = clickedWeapon.attackBoost;
        this.defenseBoost = clickedWeapon.defenseBoost;
        this.weaponImage = clickedWeapon.picture;
        displayWeapon();
        //console.log(clickedWeapon);
        //console.log(this.attack);
    },

    weapons: {
        swordShield: {
            name: "Sword",
            attack: 20,
            attackBoost: 1,
            defenseBoost: 1,
            defense: 16,
            accuracy: 0.95,
            evasion: 0.15,
            description: "High mobility, precise, balanced attack and defense. No inherent weaknesses. Attack increases by 1 every time you land an attack, defense increases by 1 every time you take damage.",
            picture: '<img src="assets/images/sword_shield.png" alt="Sword and Shield">'
        },
        greatSword: {
            name: "Great Sword",
            attack: 32,
            attackBoost: 2,
            defenseBoost: 1,
            defense: 12,
            accuracy: 0.78,
            evasion: 0.05,
            description: "All-in on offense. Low defense, low mobility, slow and misses more often, hits hard when it connects. Gains 2 Attack every time you land an attack, defense increases by 1 every time you take damage.",
            picture: '<img src="assets/images/great_sword.png" alt="Great Sword">'
        },
        lance: {
            name: "Lance",
            attack: 17,
            attackBoost: 1,
            defenseBoost: 1,
            defense: 19,
            accuracy: 0.90,
            evasion: 0.08,
            description: "Long spear and a great shield. Slightly reduced attack and accuracy, but high defense and decent evasion. Attack increases 1 by every time you land an attack, defense increases by 1 every time you take damage.",
            picture: '<img src="assets/images/lance_shield.png" alt="Lance and Shield">'
        },
        bowGun: {
            name: "Heavy Bowgun",
            attack: 26,
            attackBoost: 1,
            defenseBoost: 1,
            defense: 10,
            accuracy: 0.85,
            evasion: 0.25,
            description: "Handheld siege weapon. Hits hard and lets you keep your distance, boosting your ability to avoid attacks, but seriously lacks defense. Attack increases 1 by every time you land an attack, defense increases by 1 every time you take damage.",
            picture: '<img src="assets/images/bowgun.png" alt="Heavy Bowgun">'
        },
    },
    //called when you press Attack
    makeAttack : function() {
        
        if (monsterIsActive && huntActive) {
            
            $("#combat-log").html("");
            var toHitRoll = Math.random();
            if (toHitRoll <= this.accuracy) {
                //console.log("Your attack successfully hits the monster."); 
                this.dealDamage(monsterTarget, this.attack, playerBlock.weapon);
            } else
                //{//console.log("Your attack misses the monster.")
                combatLog("<p>Your attack misses the " + monsterTarget.name + "!</p>");

            this.sufferDamage();
        }
        //{//console.log("Nothing to hit!")};
    },

    //Called if makeAttack connects
    dealDamage : function(yourTarget, damageNum, equippedWeapon) {

        //Adds 0-2 damage randomly to attack, reduces that by the target's defense, subtracts the result from monster's currentHP
        var damageDealt = (Math.floor(Math.random() * 3) + damageNum) - yourTarget.defense;
        if (damageDealt <= 0) {
            damageDealt = 1;
        };
        yourTarget.currentHP -= damageDealt;
        var attackWord = playerBlock.verbs[Math.floor(Math.random() * playerBlock.verbs.length)];
        //console.log("Inflicted " + damageDealt + " damage to the " + yourTarget.name + " with your " + equippedWeapon.name + ".");
        combatLog("<p>You " + attackWord + " the " + yourTarget.name + " with your " + equippedWeapon + " for " + damageDealt + " damage!</p>");
        this.attack += this.attackBoost;
        updateHealthDisplay(monsterTarget);
        checkForDefeat(yourTarget);
    },

    //Called following makeAttack, inflicting damage on the player
    sufferDamage : function() {
        //Checks to see if the monster is able to counterattack (ie not dead), and if it can, player takes damage
        if (monsterIsActive) {
            var monsterMethod = monsterTarget.weapon[Math.floor(Math.random() * eval(monsterTarget.weapon.length))];
            var toHitRoll = Math.random();
            if (toHitRoll <= (monsterTarget.accuracy - this.evasion)) { 
                var damageTaken = (Math.floor(Math.random() * 4) + monsterTarget.counterAttack) - this.defense;
                if (damageTaken <= 0) {
                    damageTaken = 1;
                };
                this.currentHP -= damageTaken;
                //console.log("The " + monsterTarget.name + " " + monsterMethod + " you!" );
                //console.log("Player suffered: " + damageTaken + " damage.");
                var playerPart = playerBlock.bodyParts[Math.floor(Math.random() * playerBlock.bodyParts.length)];
                combatLog("<p>The " + monsterTarget.name + " " + monsterMethod + " you in the " + playerPart + " for " + damageTaken + " damage!</p>");
                this.defense += this.defenseBoost;
                updateHealthDisplay(playerBlock);
                checkForDefeat(this);
            } else {
                combatLog("<p>The " + monsterTarget.name + " tries and " + monsterMethod + " you, but you dodge the attack!</p>");
            }
        } 
    },

    //this function was gonna be a potion, now replaced with a "wait" for testing 
    drinkPotion : function() {
        if (monsterIsActive && huntActive) {
            
        $("#combat-log").html("");

            //Removed potions from an ability, so just making this button do nothing for testing purposes.
        /*   if (potionsRemaining > 0) {
                //console.log("Potion done drank.");
                this.currentHP += 50;
                if (this.currentHP > this.maxHP) {
                    this.currentHP = this.maxHP;
                };
                //sufferDamage in here to ensure the player doesn't take damage even though they didn't drink a potion
                this.sufferDamage();
                potionsRemaining--;

            } else
            //{//console.log("Out of potions");};*/
            combatLog("<p>You sit around doing nothing for some reason and get smacked for your idleness.</p>");
            this.sufferDamage();
        }
    }   
};

//Monster object setup

var monsterJagras ={
    name: "Great Jagras",
    type: "monster",
    attack: 0,
    counterAttack: 24,
    accuracy: 0.70,
    defense: 3,
    weapon: ["bites", "claws", "slams", "rolls onto"],
    maxHP: 75,
    currentHP: 75,
    iconId: "#jagras-holder",
    intermissionId: "#intermission-jagras-button",
    description: "Big grown-up version of the smaller, less-threatening Jagras. Big and shrugs off weak hits more easily, but has no real special attacks.",
    icon: '<img src="assets/images/icon_jagras.png" alt="Great Jagras Icon">',
    picture: '<img src="assets/images/jagras_render.png" alt="Great Jagras" id="monster-render-img">'
};

var monsterAnjanath ={
    name: "Anjanath",
    type: "monster",
    attack: 0,
    counterAttack: 30,
    accuracy: 0.75,
    defense: 4,
    weapon: ["bites", "fireblasts", "swipes at", "stomps"],
    maxHP: 100,
    currentHP: 100,
    iconId: "#anja-holder",
    intermissionId: "#intermission-anjanath-button",
    description: "Angry, with big jaws and tiny arms. Think of it as a T-Rex. Except it can shoot fire out of its nose. Don't give it black pepper. Hits a bit less often than the Great Jagras, but hits harder.",
    icon: '<img src="assets/images/icon_anja.png" alt="Anjanath Icon">',
    picture: '<img src="assets/images/anja_render.png" alt="Anjanath" id="monster-render-img">'
};

var monsterRathian ={
    name: "Rathian",
    type: "monster",
    attack: 0,
    counterAttack: 34,
    accuracy: 0.80,
    defense: 5,
    weapon: ["tailwhips", "fireballs", "divebombs", "buffets", "poisons", "chomps"],
    maxHP: 110,
    currentHP: 110,
    iconId: "#rath-holder",
    intermissionId: "#intermission-rathian-button",
    description: "What you would probably call a 'green dragon' at first glance. Flies, hits like a truck, shoots fireballs, has a tail with a poison spike. And still is less vicious than her male counterpart, Rathalos. Accurate and hits hard.",
    icon: '<img src="assets/images/icon_rath.png" alt="Rathian Icon">',
    picture: '<img src="assets/images/rathian_render.png" alt="Rathian" id="monster-render-img">'
};

//Other Global Variables

var monsterTarget = monsterJagras; //in case no monster is selected, defaults to Great Jagras
var allMonsters = [monsterJagras, monsterAnjanath, monsterRathian];
var potionsRemaining;
var monstersDefeated = [];
var huntActive = true;

//Global Functions

//Checks to see if either party's HP has dropped to 0 or below
function checkForDefeat(tUnit) {
    //Checks if the received variable is the player or the monster
    if (tUnit.type == "player") {
        if (tUnit.currentHP <= 0) {
            playerDefeated();
        }
    } else

    if (tUnit.type == "monster") {
        if (tUnit.currentHP <= 0) {
            monsterDefeated();
        }

    }
};

function playerDefeated() {
    //console.log("Player reduced to 0 or fewer HP, defeated.");
    huntActive = false;
    endQuest("failed");
}

function monsterDefeated() {
    //console.log("Monster reduced to 0 or fewer HP, player victory.");
    xOutMonster(monsterTarget.iconId);
    monstersDefeated.push(monsterTarget.name);
    monsterIsActive = false;

    if (monstersDefeated.length < allMonsters.length) {
        monsterSelectDialog();
    } else {
    gameComplete();
    endQuest("success");
}
}

function initHandlers() {
    $("#attack-button").on("click", function() {
        playerBlock.makeAttack();
    })

    $("#potion-button").on("click", function() {
        playerBlock.drinkPotion();
    })

    $(".weapon-select-option").on("click", function() {
        playerBlock.weaponSwap(playerBlock.weapons[$(this).attr("value")]);
    })

    $(".weapon-select-option").hover( function() {
        weaponHover($(this).attr("value"));
    }, function() {
        $("#weapon-description-p").text("Select a weapon above. Hover over one to read its description and stats.");
    }
    )

    $(".monster-select-option").on("click", function() {
        monsterTarget = eval($(this).attr("value"));
    })
    $(".monster-select-option").hover( function() {
        monsterHover(eval($(this).attr("value")));
    }, function () {
        $("#monster-description-p").text("Select a monster above. Hover over one to read a description.");
    })

    $(".submission-button").on("click", function() {
        beginGame();
    })

    $(".flask-button").on("click", function() {
        alert("You cannot get ye flask!");
    })

    $(".intermission-select-option").on("click", function() {
        var clickedMonster = eval($(this).attr("value"));
        if ($.inArray(clickedMonster.name, monstersDefeated) == -1) {
            monsterTarget = clickedMonster;
            monsterIsActive = true;
            nextMonsterSelected();
            updateHealthDisplay(monsterTarget);
        }
    })

    $("#restart-hunt-button").on("click", function() {
        restartGame();
    })
}

function combatLog(input) {
    $("#combat-log").append(input);
}

function monsterHover(input) {
    $("#monster-description-p").text(input.description);
}

function weaponHover(input) {
    var evalWeapon = eval(playerBlock.weapons[input]);
    $("#weapon-description-p").text(evalWeapon.description);
}

function displayWeapon() {
    $("#hunter-weapon-right").html(playerBlock.weaponImage);
}

//removes the prep-page and shows the combat screen
function beginGame() {
    setMonsterRender();
    $("#preparation-page").addClass("d-none");
    $("#gameplay-page").removeClass("d-none");
    $("#monster-render-display").removeClass("d-none");
    beginHunt();
}


//Starts the game over
function restartGame() {
    initGame();
    $("#quest-failed-screen").addClass("d-none");
    $("#gameplay-page").addClass("d-none");
    $("#preparation-page").removeClass("d-none");
    $("#combat-log").html("");
}

//Crosses out the monster's icon on the top left, fades out the monster on the select dialog
function xOutMonster(input) {
    var crossImg = $("<img>", {
        "class" : "floating-x",
        "src" : "assets/images/crossout.png"
    });
    $(input).append(crossImg);

    $(monsterTarget.intermissionId).addClass("disabled");

}


//Removes combat screen, displays intermission screen
function monsterSelectDialog() {
    $("#monster-render-display").addClass("d-none");
    $("#intermission-screen").removeClass("d-none");
    $("#intermission-screen").addClass("d-flex");
    $("#intermission-monster-select-div").removeClass("d-none");
    $("#intermission-monster-select-div").addClass("d-flex");
}


//Removes intermission screen, returns player to combat screen
function nextMonsterSelected() {
    
    setMonsterRender();
    
    $("#monster-render-display").removeClass("d-none");
    $("#intermission-screen").addClass("d-none");
    $("#intermission-screen").removeClass("d-flex");
    $("#intermission-monster-select-div").addClass("d-none");
    $("#intermission-monster-select-div").removeClass("d-flex");
}

function updateHealthDisplay(input) {
    if (input.type == "player") {
        $("#hunter-health-id").css("height", input.currentHP/input.maxHP*100+"%");
    } else {
    if (input.type == "monster") {
        $("#monster-health-bar").css("width", input.currentHP/input.maxHP*100+"%");
    }
    }
}

function endQuest(input) {
    $("#monster-render-display").addClass("d-none");
    if (input == "failed") {
        $("#end-screen-header").text("Carted!");
        $("#end-screen-text").text("Ouch! That last attack knocked you out cold! You wake up at your camp, bruised but alive. Dust yourself off and try again!");
    }
    $("#quest-failed-screen").removeClass("d-none");
}

function gameComplete() {
    huntActive = false;
    $("#end-screen-header").text("Quest Complete!");
    $("#end-screen-text").text("You did it! You defeated all the monsters in the hunt-a-thon and returned home safely. You're awarded with a big pile of zenny (that's money), and make a new suit of armor out of all the hides and scales you collected. Click 'Restart' below to start the game over if you wish to go again.")

}

function setMonsterRender() {
    $("#monster-render-div").html(monsterTarget.picture);
}