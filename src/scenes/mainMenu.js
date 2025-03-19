import Phaser from 'phaser';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
        console.log("MainMenu Scene Loaded");
    }

    init(data) {

        this.assetPathUrl = data.assetPathUrl;
        console.log("asset path url: " + this.assetPathUrl);
    }

    preload() {
        this.load.image('bgImage', 'assets/images/23.png');
        this.load.image('playBtn', 'assets/images/PLAY.png');

    }

    create() {
        // Create the background image and set its origin
        const bgImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 5, 'bgImage');
        bgImage.setOrigin(0.5, 0.5);  // Set origin to center for proper scaling and positioning
      
        // Create the title text
        const title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 4.5, " SPOT THE \n ", {
            fontSize: '36px',
            fontStyle: 'bold',
            fill: 'lightgreen',
            align: 'center',
            fontFamily: "InterItalic"
        }).setOrigin(0.5, 0.5);

        const titleTwo = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 4, " \n DIFFERENCES ", {
            fontSize: '48px',
            fontStyle: 'bold',
            fill: 'lightblue',
            align: 'center',
            fontFamily: "lightgreen"
        }).setOrigin(0.5, 0.5);

        //TODO Play button
        const graphics = this.add.graphics();
        const buttonX = this.cameras.main.width / 2;
        const buttonY = this.cameras.main.height / 2;
        const buttonWidth = 260;
        const buttonHeight = 50;
        const buttonRadius = 20;

      

        const playButton = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'playBtn')
            .setOrigin(0.5)
            .setInteractive()
            .setDisplaySize(140,45);


            this.tweens.add({
                targets:playButton,
                displayWidth: 160,  // Target width
                displayHeight: 55, // Target height
                duration: 700,
                yoyo: true,
                repeat: -1,
                onUpdate: function (tween, target) {
                    target.scaleX = target.displayWidth / target.width;
                    target.scaleY = target.displayHeight / target.height;
                }
            });

      

            playButton.on('pointerdown', () => {
            this.scene.launch('GamePlayScene',{assetPathUrl:this.assetPathUrl});
        });

    
    }
}
