
// let clickedDifferences = new Set()

export class GamePlayScene extends Phaser.Scene {
    constructor() {
        super({ key: "GamePlayScene" });
        this.differenceImages = [
            'differenceImagesOne',
            'staticImageOne',
            'staticImageTwo',
            'differenceImagesTwo',
            'differenceImagesThree'
        ];
        // Store image objects




    }

    init() {
        this.differenceObjects = [];
        this.clickedDifferences = new Set();  // To track clicked differences
        this.currentDifferences = 0;          // Initialize currentDifferences
        this.maxDifferences = 3;          // Set this to your desired max differences
        this.currentHealth = 0;
        this.maxHealth = 3;
        this.isPanelClosed = true;

    }

    preload() {
        this.load.image('orginleImage', 'assets/images/final.png');
        this.load.image('differenceImagesOne', 'assets/images/1(1).png');
        this.load.image('staticImageOne', 'assets/images/2(1).png');
        this.load.image('staticImageTwo', 'assets/images/3(1).png');
        this.load.image('differenceImagesTwo', 'assets/images/4(1).png');
        this.load.image('differenceImagesThree', 'assets/images/5(1).png');
        this.load.image('infoIcon', 'assets/images/information.png');
        this.load.image('closeIcon', 'assets/images/close(1).png');
        this.load.image('panelBg', 'assets/images/11.png');
        this.load.image('gamePlayBg', 'assets/images/snk(1).png');

    }

    create() {
        let infoIcon = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 5, 'gamePlayBg');
        this.InforPanel();
    }




    InforPanel() {
        let infoIcon = this.add.image(50, 25, 'infoIcon') // Adjusted position
            .setOrigin(1, 0)
            .setScale(0.07)
            .setInteractive();

        // Popup background
        let popupBg = this.add.image(210, 364, 'panelBg') // Centered at 210 (half of 420)
            .setDisplaySize(380, 500) // Adjusted size
            .setOrigin(0.5)
            .setVisible(true);

        let titleText = this.add.text(210, 250, "How to Play", {
            fontFamily: 'Roboto',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setVisible(true);

        let popupText = this.add.text(210, 350, "- Click cards to reveal images\n\n- Match all pairs to win\n\n- Wrong pairs end the game", {
            fontFamily: 'Roboto',
            fontSize: '18px',
            color: '#ffffff',
            align: 'left',
            wordWrap: { width: 360 }
        }).setOrigin(0.5).setVisible(true);

        let finleText = this.add.text(210, 450, "Good luck!", {
            fontFamily: 'Roboto',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setVisible(true);

        let closeButton = this.add.image(370, 150, "closeIcon") // Adjusted position
            .setOrigin(1, 0)
            .setScale(0.06)
            .setVisible(true)
            .setInteractive();

        infoIcon.on('pointerdown', () => {
            popupBg.setVisible(true).setDepth(100);
            popupText.setVisible(true).setDepth(101);
            titleText.setVisible(true).setDepth(102);
            finleText.setVisible(true).setDepth(103);
            closeButton.setVisible(true).setDepth(104);
        });

        closeButton.on('pointerdown', () => {
            popupBg.setVisible(false);
            popupText.setVisible(false);
            titleText.setVisible(false);
            finleText.setVisible(false);
            closeButton.setVisible(false);

            if (this.isPanelClosed) {

                this.imagesGenarate();

            }
            this.isPanelClosed = false;
        });
    }

    imagesGenarate() {
        let orginleImage = this.add.image(100, 350, 'orginleImage')
            .setInteractive()
            .setDisplaySize(150, 300)
            .setOrigin(0.5, 0.5);


        //* Create difference images (all at the same position)
        this.differenceImages.forEach((imageKey) => {
            let diffImage = this.add.image(325, 350, imageKey)
                .setInteractive()
                .setDisplaySize(150, 300)
                .setOrigin(0.5, 0.5);

            this.differenceObjects.push(diffImage); // Store reference


            // Add pointerdown event
            diffImage.on('pointerdown', (pointer, localX, localY) => {
                this.checkAllDifferences(localX, localY);
            });
        });
    }


    checkAllDifferences(x, y) {
        console.log(`Checking all layers at X: ${x}, Y: ${y}`);

        let foundAny = false;

        // Check all layers at the clicked position
        this.differenceObjects.forEach((layer) => {
            let pixelData = this.textures.getPixel(x, y, layer.texture.key);

            if (pixelData && pixelData.a > 0) {
                console.log(`Found difference in ${layer.texture.key} at X: ${x}, Y: ${y}`);

                // Check if the clicked image is a "difference" image
                if (layer.texture.key.includes("difference")) {

                    // Ensure this "difference" image hasn't been clicked already
                    if (!this.clickedDifferences.has(layer.texture.key)) {
                        // Increment count and mark this image as clicked


                        this.tweens.add({
                            targets: layer,
                            scaleX: 0,
                            scaleY: 0,
                            alpha: 0,
                            duration: 150,
                            ease: 'Linear',
                            onComplete: () => {
                                //   cardBackImage.setVisible(false);
                                // characterImage.setVisible(false);
                            }
                        });




                        this.currentDifferences++;
                        this.clickedDifferences.add(layer.texture.key);  // Add to the set of clicked images

                        console.log("The word 'difference' is in the texture key!" + " : " + this.currentDifferences);

                        // Check if all differences are found
                        if (this.currentDifferences == this.maxDifferences) {

                            this.resetGameData();

                            this.time.delayedCall(750, () => {

                                this.scene.start('PlayerWon');
                                this.scene.stop('GamePlayScene');

                            });
                        } else {

                            /*   this.resetGameData();
 
                          this.time.delayedCall(750, () => {
 
                          this.scene.start('PlayerLost');
                          }); */

                        }
                    } else {
                        console.log("This difference has already been clicked!");
                    }
                } else {
                    //TODO Make player health get low 
                    this.maxHealth--;
                    console.log(`Playet health : {this.maxHealth}`);

                    if (this.maxHealth == 0) {
                        this.resetGameData();

                        this.time.delayedCall(750, () => {

                            this.scene.start('PlayerLost');
                            // this.scene.stop('GamePlayScene');

                        });
                    }
                }

                foundAny = true;
            }
        });

        if (!foundAny) {
            console.log("No non-transparent pixels found on any layer.");
        }
    }


    resetGameData() {
        this.clickedDifferences.clear();    // Clear the clicked differences set
        this.currentDifferences = 0;  // Reset currentDifferences
        console.log('Game data has been reset!');
    }

}
