var g_encounterData = {
    zones: [
        {
            zone: "1",
            encounters: [
                { name: "A slime", monsters: [0] },
                { name: "A rat", monsters: [1] },
                { name: "A snake", monsters: [2] },
                { name: "2 slimes", monsters: [0, 0] },
                { name: "A rat and a slime", monsters: [1, 0] }
            ]
        },
        {
            zone: "starter_field",
            encounters: [
                { name: "Slime", monsters: [0] },
                { name: "A rat", monsters: [1] },
                { name: "Two slimes", monsters: [0, 0] },
                { name: "Rat and slime", monsters: [1, 0] }
            ]
        }
    ]
};

var g_monsterData = {
    monsters: [
        {
            id: 0,
            name: "slime",
            hp: 15,
            attack: 10,
            defense: 0,
            exp: 5,
            gold: 5,
            imgRef: "enemies",
            left: 4,
            top: 109,
            width: 31,
            height: 24
        },
        {
            id: 1,
            name: "rat",
            hp: 25,
            attack: 15,
            defense: 2,
            exp: 10,
            gold: 5,
            imgRef: "enemies",
            left: 7,
            top: 498,
            width: 63,
            height: 55
        },
        {
            id: 2,
            name: "snake",
            hp: 30,
            attack: 20,
            defense: 6,
            exp: 15,
            gold: 10,
            imgRef: "enemies",
            left: 7,
            top: 160,
            width: 48,
            height: 59
        },
        {
            id: 3,
            name: "blue slime",
            hp: 20,
            attack: 20,
            defense: 20,
            exp: 20,
            gold: 10,
            imgRef: "enemies",
            left: 4,
            top: 109,
            width: 31,
            height: 24
        },
        {
            id: 4,
            name: "cocatrice",
            hp: 40,
            attack: 25,
            defense: 10,
            exp: 25,
            gold: 15,
            imgRef: "enemies",
            left: 7,
            top: 160,
            width: 48,
            height: 59
        },
        {
            id: 5,
            name: "red slime",
            hp: 35,
            attack: 30,
            defense: 15,
            exp: 30,
            gold: 20,
            imgRef: "enemies",
            left: 4,
            top: 109,
            width: 31,
            height: 24
        },
        {
            id: 6,
            name: "white rat",
            hp: 20,
            attack: 18,
            defense: 5,
            exp: 12,
            gold: 8,
            imgRef: "enemies",
            left: 7,
            top: 498,
            width: 63,
            height: 55
        },
        {
            id: 7,
            name: "cobra",
            hp: 45,
            attack: 28,
            defense: 8,
            exp: 28,
            gold: 18,
            imgRef: "enemies",
            left: 7,
            top: 160,
            width: 48,
            height: 59
        },
        {
            id: 8,
            name: "wolf",
            hp: 50,
            attack: 32,
            defense: 12,
            exp: 35,
            gold: 22,
            imgRef: "enemies",
            left: 7,
            top: 160,
            width: 48,
            height: 59
        },
        {
            id: 9,
            name: "mage",
            hp: 40,
            attack: 40,
            defense: 5,
            exp: 50,
            gold: 30,
            imgRef: "enemies",
            left: 7,
            top: 160,
            width: 48,
            height: 59
        },
        {
            id: 10,
            name: "rat king",
            hp: 200,
            attack: 50,
            defense: 20,
            exp: 500,
            gold: 200,
            imgRef: "enemies",
            left: 664,
            top: 249,
            width: 32,
            height: 58
        }
    ]
};

var g_monsterSpells = {
    spells: []
};
