
let clickedDifferences = new Set()

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
        this.differenceObjects = [];  // Store image objects


        this.clickedDifferences = new Set();  // To track clicked differences
        this.currentDifferences = 0;          // Initialize currentDifferences
        this.maxDifferences     = 3;          // Set this to your desired max differences
        this.currentHealth      = 0;
        this.maxHealth          = 3;

    }

    init() {
        this.resetGameData();
    }

    preload() {
        this.load.image('orginleImage', 'assets/images/final.png');
        this.load.image('differenceImagesOne', 'assets/images/1(1).png');
        this.load.image('staticImageOne', 'assets/images/2(1).png');
        this.load.image('staticImageTwo', 'assets/images/3(1).png');
        this.load.image('differenceImagesTwo', 'assets/images/4(1).png');
        this.load.image('differenceImagesThree', 'assets/images/5(1).png');
    }

    create() {


        let orginleImage = this.add.image(100, 250, 'orginleImage')
            .setInteractive()
            .setDisplaySize(150, 300)
            .setOrigin(0.5, 0.5);


          //* Create difference images (all at the same position)
        this.differenceImages.forEach((imageKey) => {
            let diffImage = this.add.image(300, 250, imageKey)
                .setInteractive()
                .setDisplaySize(150, 300)
                .setOrigin(0.5, 0.5);

            this.differenceObjects.push(diffImage);  // Store reference

              // Add pointerdown event
            diffImage.on('pointerdown', (pointer, localX, localY) => {
                this.checkAllDifferences(localX, localY);
            });
        });
    }; 
    
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
                            targets   : layer,
                            scaleX    : 0,
                            scaleY    : 0,
                            alpha     : 0,
                            duration  : 150,
                            ease      : 'Linear',
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
                    this.currentHealth--;
                    if (this.currentHealth == 0) {
                        this.resetGameData();

                        this.time.delayedCall(750, () => {

                            this.scene.start('PlayerLost');
                      this.scene.stop('GamePlayScene');

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
        this.currentDifferences       = 0;  // Reset currentDifferences
        console.log('Game data has been reset!');
    }

}
