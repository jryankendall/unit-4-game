$(document).ready( function() {
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
    pr.weapon = "none";
    potionsRemaining = 3;
    monstersDefeated = ["none"];
}

function initMonsters() {
    //Resets all monster's currentHP to max, makes it active
    var monsterArray = [monsterJagras, monsterAnjanath, monsterRathian];
    for (i = 0; i < monsterArray.length; i++) {
        var mrI = monsterArray[i];
        mrI.currentHP = mrI.maxHP;
    }
    monsterIsActive = true;
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
    description: "You, person crazy enough to fight dinosaurs and dragons with a sword.",
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
        console.log(clickedWeapon);
        console.log(this.attack);
    },

    weapons: {
        swordShield: {
            name: "Sword and Shield",
            attack: 20,
            attackBoost: 1,
            defenseBoost: 1,
            defense: 15,
            accuracy: 0.95,
            evasion: 0.15,
            description: "High mobility, precise, balanced attack and defense. No inherent weaknesses.",
            picture: '<img src="assets/images/sword_shield.png" alt="Sword and Shield">'
        },
        greatSword: {
            name: "Great Sword",
            attack: 32,
            attackBoost: 2,
            defenseBoost: 1,
            defense: 10,
            accuracy: 0.70,
            evasion: 0.0,
            description: "All-in on offense. Low defense, low mobility, slow and misses more often, hits hard when it connects. Gains power twice as quickly as other weapons.",
            picture: '<img src="assets/images/great_sword.png" alt="Great Sword">'
        },
        lance: {
            name: "Lance and Shield",
            attack: 17,
            attackBoost: 1,
            defenseBoost: 2,
            defense: 15,
            accuracy: 0.85,
            evasion: 0.08,
            description: "Long spear and a great shield. Slightly reduced attack and accuracy, but high defense and decent evasion. Gains defense twice as quickly as other weapons.",
            picture: '<img src="assets/images/lance_shield.png" alt="Lance and Shield">'
        },
        bowGun: {
            name: "Heavy Bowgun",
            attack: 25,
            attackBoost: 1,
            defenseBoost: 1,
            defense: 6,
            accuracy: 0.85,
            evasion: 0.25,
            description: "Handheld siege weapon. Hits hard and lets you keep your distance, boosting your ability to avoid attacks, but seriously lacks defense.",
            picture: '<img src="assets/images/bowgun.png" alt="Heavy Bowgun">'
        },
    },
    makeAttack : function() {
        var toHitRoll = Math.random();
        if (toHitRoll <= this.accuracy) {
            console.log("Your attack successfully hits the monster."); 
            this.dealDamage(monsterTarget, this.attack, playerBlock.weapon);
        } else
            {console.log("Your attack misses the monster.")
        };

        this.sufferDamage();
        
    },
    dealDamage : function(yourTarget, damageNum, equippedWeapon) {

        //Adds 0-2 damage randomly to attack, reduces that by the target's defense, subtracts the result from monster's currentHP
        var damageDealt = (Math.floor(Math.random() * 3) + damageNum) - yourTarget.defense;
        if (damageDealt <= 0) {
            damageDealt = 1;
        };
        yourTarget.currentHP -= damageDealt;
        console.log("Inflicted " + damageDealt + " damage to the " + yourTarget.name + " with your " + equippedWeapon.name + ".");
        this.attack += this.attackBoost;
        checkForDefeat(yourTarget);
    },
    sufferDamage : function() {
        //Checks to see if the monster is able to counterattack (ie not dead), and if it can, player takes damage
        if (monsterIsActive) {
            var damageTaken = (Math.floor(Math.random() * 4) + monsterTarget.counterAttack) - this.defense;
            if (damageTaken <= 0) {
                damageTaken = 1;
            };
            this.currentHP -= damageTaken;
            var monsterMethod = monsterTarget.weapon[Math.floor(Math.random() * monsterTarget.weapon.length)];
            console.log("The " + monsterTarget.name + " " + monsterMethod + " you!" );
            console.log("Player suffered: " + damageTaken + " damage.");
            combatLog("The " + monsterTarget.name + " " + monsterMethod + " you for " + damageTaken + " damage!");
            this.defense += this.defenseBoost;
            checkForDefeat(this);
        } else
        {console.log("Monster cannot attack, no counter-attack suffered.");};
    },
    drinkPotion : function() {
        if (potionsRemaining > 0) {
            console.log("Potion done drank.");
            this.currentHP += 50;
            if (this.currentHP > this.maxHP) {
                this.currentHP = this.maxHP;
            };
            //sufferDamage in here to ensure the player doesn't take damage even though they didn't drink a potion
            this.sufferDamage();
            potionsRemaining--;

        } else
        {console.log("Out of potions");};
    }
};

//Monster object setup

var monsterJagras ={
    name: "Great Jagras",
    type: "monster",
    attack: 0,
    counterAttack: 24,
    accuracy: 0.80,
    defense: 4,
    weapon: ["bites", "claws", "slams"],
    maxHP: 75,
    currentHP: 75,
    description: "Big grown-up version of the smaller, less-threatening Jagras. Big and shrugs off weak hits more easily, but has no real special attacks.",
    icon: '<img src="assets/images/icon_jagras.png" alt="Great Jagras Icon">',
    picture: '<img src="assets/images/jagras_render.png" alt="Great Jagras">'
};

var monsterAnjanath ={
    name: "Anjanath",
    type: "monster",
    attack: 0,
    counterAttack: 29,
    accuracy: 0.75,
    defense: 2,
    weapon: ["bites", "fireblasts", "swipes at"],
    maxHP: 100,
    currentHP: 100,
    description: "Angry, with big jaws and tiny arms. Think of it as a T-Rex. Except it can shoot fire out of its nose. Don't give it black pepper. Hits a bit less often than the Great Jagras, but hits harder.",
    icon: '<img src="assets/images/icon_anja.png" alt="Anjanath Icon">',
    picture: '<img src="assets/images/anja_render.png" alt="Anjanath">'
};

var monsterRathian ={
    name: "Rathian",
    type: "monster",
    attack: 0,
    counterAttack: 33,
    accuracy: 0.85,
    defense: 2,
    weapon: ["tailwhips", "fireballs", "divebombs", "buffets"],
    maxHP: 80,
    currentHP: 80,
    description: "What you would probably call a 'green dragon' at first glance. Flies, hits like a truck, shoots fireballs, has a tail with a poison spike. And still is less vicious than her male counterpart, Rathalos. Accurate and hits hard.",
    icon: '<img src="assets/images/icon_rath.png" alt="Rathian Icon">',
    picture: '<img src="assets/images/rathian_render.png" alt="Rathian">'
};

//Other Global Variables

var monsterTarget = monsterJagras; //in case no monster is selected, defaults to Great Jagras
var potionsRemaining;
var monstersDefeated = ["none"];
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

    } else
    {console.log("Something went wrong in checkForDefeat(x).")};
};

function playerDefeated() {
    console.log("Player reduced to 0 or fewer HP, defeated.");
    huntActive = false;
}

function monsterDefeated() {
    console.log("Monster reduced to 0 or fewer HP, player victory.");
    monsterIsActive = false;
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
        monsterTarget = $(this).attr("value");
    })
    $(".monster-select-option").hover( function() {
        monsterHover(eval($(this).attr("value")));
    }, function () {
        $("#monster-description-p").text("Select a monster above. Hover over one to read a description.");
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
    $("#ingame-weapon-display").html(playerBlock.weaponImage);
}