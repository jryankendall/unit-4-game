function initGame() {
    initPlayer();
    initMonsters();

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
            description: "High mobility, precise, balanced attack and defense. No inherent weaknesses."
        },
        greatSword: {
            name: "Great Sword",
            attack: 32,
            attackBoost: 2,
            defenseBoost: 1,
            defense: 10,
            accuracy: 0.70,
            evasion: 0.0,
            description: "All-in on offense. Low defense, low mobility, slow and misses more often, hits hard when it connects. Gains power twice as quickly as other weapons."
        },
        lance: {
            name: "Lance and Shield",
            attack: 16,
            attackBoost: 1,
            defenseBoost: 2,
            defense: 18,
            accuracy: 0.85,
            evasion: 0.08,
            description: "Long spear and a great shield. Slightly reduced attack and accuracy, but high defense and decent evasion. Gains defense twice as quickly as other weapons."
        },
        bowGun: {
            name: "Heavy Bowgun",
            attack: 25,
            attackBoost: 1,
            defenseBoost: 1,
            defense: 6,
            accuracy: 0.85,
            evasion: 0.25,
            description: "Handheld siege weapon. Hits hard and lets you keep your distance, boosting your ability to avoid attacks, but seriously lacks defense."
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
        var damageDealt = (Math.floor(Math.random() * 3) + damageNum) - yourTarget.defense;
        if (damageDealt <= 0) {
            damageDealt = 1;
        };
        yourTarget.currentHP -= damageDealt;
        console.log("Inflicted " + damageDealt + " damage to the " + yourTarget.name);
        this.attack += this.attackBoost;
        checkForDefeat(yourTarget);
    },
    sufferDamage : function() {
        //Checks to see if the monster is able to counterattack (ie not dead)
        if (monsterIsActive) {
            var damageTaken = (Math.floor(Math.random() * 4) + monsterTarget.counterAttack) - this.defense;
            if (damageTaken <= 0) {
                damageTaken = 1;
            };
            this.currentHP -= damageTaken;
            console.log("Player suffered: " + damageTaken + " damage.");
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
    description: "Angry, with big jaws and tiny arms. Think of it as a T-Rex. Except it can shoot fire out of its nose. Don't give it black pepper. Hits a bit less often than the Great Jagras, but hits harder."
};

var monsterRathian ={
    name: "Rathian",
    type: "monster",
    attack: 0,
    counterAttack: 33,
    accuracy: 0.85,
    defense: 1,
    weapon: "tailspike, fire breath",
    maxHP: 80,
    currentHP: 80,
    description: "What you would probably call a 'green dragon' at first glance. Flies, hits like a truck, shoots fireballs, has a tail with a poison spike. And still is less vicious than her male counterpart, Rathalos. Accurate and hits hard."
};

//Other Global Variables

var monsterTarget = monsterJagras; //in case no monster is selected, defaults to Great Jagras
var potionsRemaining;

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
}

function monsterDefeated() {
    console.log("Monster reduced to 0 or fewer HP, player victory.");
    monsterIsActive = false;
}