//Character setup
var playerBlock = {
    name: "Hunter",
    type: "player", 
    attack: 0,
    accuracy: 1.0,
    counterAttack: 0, 
    defense: 0, 
    evasion: 0.0,
    weapon: "none",
    maxHP: 100,
    currentHP: 100,
    description: "You, person crazy enough to fight dinosaurs and dragons with a sword.",
    weaponSwap : function(clickedWeapon) {
        this.attack = clickedWeapon.attack;
        this.defense = clickedWeapon.defense;
        this.accuracy = clickedWeapon.accuracy;
        this.weapon = clickedWeapon.name;
        this.evasion = clickedWeapon.evasion;
        console.log(clickedWeapon);
        console.log(this.attack);
    },

    weapons: {
        swordShield: {
            name: "Sword and Shield",
            attack: 15,
            defense: 15,
            accuracy: 0.95,
            evasion: 0.15,
            description: "High mobility, precise, balanced attack and defense."
        },
        greatSword: {
            name: "Great Sword",
            attack: 30,
            defense: 9,
            accuracy: 0.70,
            evasion: 0.0,
            description: "All-in on offense. Low defense, low mobility, slow and misses more often, hits hard when it connects."
        },
        lance: {
            name: "Lance and Shield",
            attack: 14,
            defense: 20,
            accuracy: 0.85,
            evasion: 0.08,
            description: "Long spear and a great shield. Slightly reduces attack and accuracy, but high defense and decent evasion."
        }
    },
    makeAttack : function() {
        var toHitRoll = Math.random();
        if (toHitRoll <= this.accuracy) {
            console.log("Your attack successfully hits the monster.");
            console.log("The monster suffers " + this.attack - monsterTarget.defense + " points of damage." );
            this.dealDamage(monsterTarget, this.attack);
        } else
            {console.log("Your attack misses the monster.")
        }

        this.sufferDamage();
        
    },
    dealDamage : function(yourTarget, damageNum) {
        yourTarget.currentHP -= damageNum - yourTarget.defense;
        checkForDefeat(yourTarget);
    },
    sufferDamage : function() {
        //Checks to see if the monster is able to counterattack
        if (monsterIsActive) {    
            this.currentHP -= monsterTarget.counterAttack - this.defense;
            checkForDefeat(this);
        } else
        {console.log("Monster defeated, no damage taken.");}
    }
};

var monsterJagras ={
    name: "Great Jagras",
    type: "monster",
    attack: 0,
    counterAttack: 24,
    accuracy: 0.80,
    defense: 4,
    weapon: "claws, bite",
    maxHP: 75,
    currentHP: 75,
    description: "Big grown-up version of the smaller, less-threatening Jagras. Big and shrugs off weak hits more easily, but has no real special attacks."
};

var monsterAnjanath ={
    name: "Anjanath",
    type: "monster",
    attack: 0,
    counterAttack: 29,
    accuracy: 0.75,
    defense: 2,
    weapon: "bite, fire breath",
    maxHP: 100,
    currentHP: 100,
    description: "Angry, with big jaws and tiny arms. Think of it as a T-Rex. Except it can shoot fire out of its nose. Don't give it black pepper."
};

var monsterRathian ={
    name: "Rathian",
    type: "monster",
    attack: 0,
    counterAttack: 33,
    accuracy: 0.85,
    defense: 1,
    weapon: "tailspike, fire breath",
    maxHP: 90,
    currentHP: 90,
    description: "What you would probably call a 'green dragon' at first glance. Flies, hits like a truck, shoots fireballs, has a tail with a poison spike. And still is less vicious than her male counterpart, Rathalos."
};


var monsterTarget = monsterJagras;

function checkForDefeat(tUnit) {
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