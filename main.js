var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: { default: 'arcade' },
    scene: { preload, create, update }
};

var player, cewek, cursors, magicEffect;
var dialogBox, dialogText, dialogIndex = 0;
var dialogData = [
    "???: Siapa kamu?",
    "Kamu: Aku... aku cuma tersesat di hutan ini.",
    "???: Hutan ini bukan tempat biasa...",
    "Kamu: (Kenapa dia terlihat begitu cantik?)",
    "???: (Aku bisa mendengar pikirannya?! Dia suka sama aku?!)"
];

var game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/forest-bg.png');
    this.load.spritesheet('player', 'assets/player-sprite.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('cewek', 'assets/girl-character.png');
    this.load.spritesheet('magic', 'assets/magic-effect.png', { frameWidth: 64, frameHeight: 64 });
    this.load.audio('bgm', 'assets/music.mp3');
    this.load.audio('magicSound', 'assets/magic-sound.wav');
}

function create() {
    this.add.image(400, 300, 'background');

    player = this.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);
    cewek = this.physics.add.image(600, 300, 'cewek');

    cursors = this.input.keyboard.createCursorKeys();

    // Animasi magic effect
    magicEffect = this.add.sprite(600, 280, 'magic').setVisible(false);
    this.anims.create({
        key: 'magicGlow',
        frames: this.anims.generateFrameNumbers('magic', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    // Dialog system
    dialogBox = document.createElement('div');
    dialogBox.id = 'dialog-box';
    dialogBox.style.position = 'absolute';
    dialogBox.style.bottom = '20px';
    dialogBox.style.left = '50%';
    dialogBox.style.transform = 'translateX(-50%)';
    dialogBox.style.width = '70%';
    dialogBox.style.padding = '10px';
    dialogBox.style.background = 'rgba(0, 0, 0, 0.7)';
    dialogBox.style.color = 'white';
    dialogBox.style.fontSize = '16px';
    dialogBox.style.borderRadius = '10px';
    dialogBox.style.display = 'none';

    dialogText = document.createElement('p');
    dialogBox.appendChild(dialogText);

    var nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.onclick = nextDialog;
    dialogBox.appendChild(nextButton);

    document.body.appendChild(dialogBox);

    this.physics.add.overlap(player, cewek, startDialog, null, this);

    let music = this.sound.add('bgm', { loop: true });
    music.play();
}

function update() {
    if (cursors.left.isDown) player.x -= 5;
    if (cursors.right.isDown) player.x += 5;
    if (cursors.up.isDown) player.y -= 5;
    if (cursors.down.isDown) player.y += 5;
}

function startDialog() {
    dialogBox.style.display = 'block';
    dialogText.innerText = dialogData[dialogIndex];

    // Efek magic saat cewek baca pikiran
    if (dialogIndex === 4) {
        magicEffect.setVisible(true);
        magicEffect.play('magicGlow');
        let magicSound = game.sound.add('magicSound');
        magicSound.play();
    }
}

function nextDialog() {
    dialogIndex++;
    if (dialogIndex < dialogData.length) {
        dialogText.innerText = dialogData[dialogIndex];

        if (dialogIndex === 4) {
            magicEffect.setVisible(true);
            magicEffect.play('magicGlow');
        }
    } else {
        dialogBox.style.display = 'none';
        magicEffect.setVisible(false);
        dialogIndex = 0;
    }
}
