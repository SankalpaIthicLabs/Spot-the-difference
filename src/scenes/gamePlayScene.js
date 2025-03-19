import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export class GamePlayScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GamePlayScene",
        });

        this.differenceImages = [
            'differenceImagesOne',
            'differenceImagesTwo',
            'differenceImagesThree',
            'differenceImagesFore',
            'differenceImagesFive',
            'differenceImagesSix'
        ];
    }

    init(data) {

        this.assetPathUrl = data.assetPathUrl;
        console.log("asset path url: " + this.assetPathUrl);


        this.differenceObjects  = [];
        this.clickedDifferences = new Set();
        this.currentDifferences = 0;
        this.maxDifferences     = 6;
        this.currentHealth      = 0;
        this.maxHealth          = 3;
        this.isPanelClosed      = true;
        this.healthIcons        = [];
        this.progressText;
    }

    preload() {
        this.load.image('orginleImage', 'assets/images/FK.png');
        this.load.image('staticImageOne', 'assets/images/FK.png');

        this.load.image('differenceImagesOne', this.assetPathUrl + 'assets/images/al.png');
        this.load.image('differenceImagesTwo', this.assetPathUrl + 'assets/images/b.png');
        this.load.image('differenceImagesThree', this.assetPathUrl + 'assets/images/g.png');
        this.load.image('differenceImagesFore', this.assetPathUrl + 'assets/images/mu.png');
        this.load.image('differenceImagesFive', this.assetPathUrl + 'assets/images/re.png');
        this.load.image('differenceImagesSix', this.assetPathUrl + 'assets/images/sn.png');

        this.load.image('infoIcon', 'assets/images/information.png');
        this.load.image('closeIcon', 'assets/images/close(1).png');
        this.load.image('panelBg', 'assets/images/11.png');
        this.load.image('healthFilled', 'assets/images/HeathFilled.png');
        this.load.image('healthEmpty', 'assets/images/HealthEmpty.png');
        this.load.image('spotCircleImage', 'assets/images/spotCircleImage.png');
        this.load.image('wrongPick', 'assets/images/wrongPick.png');
        this.load.audio('correct', 'assets/audios/interface-2-126517.mp3');
        this.load.audio('wrong', 'assets/audios/wrong-answer-126515.mp3');
    }

    create() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x2e3d55, 1);
        graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        this.InforPanel();
        this.createHealthIcons();
    }

    createHealthIcons() {
        const iconSize = 30;
        const spacing  = 10;
        const startX   = this.cameras.main.width / 2 - (iconSize + spacing) * (this.maxHealth - 1) / 2;
        const startY   = 50;

        for (let i = 0; i < this.maxHealth; i++) {
            let healthIcon = this.add.image(startX + i * (iconSize + spacing), startY, 'healthFilled')
                .setDisplaySize(iconSize, iconSize)
                .setOrigin(0.5, 0.5);

            this.healthIcons.push(healthIcon);
        }
        this.progressText = this.add.text(340, 40, `0 / ${this.maxDifferences}`, { fontSize: '24px', fill: '#fff', fontFamily: 'lightgreen', fontStyle: 'bold' }).setOrigin(1, 0);
    }

    updateHealthIcons() {
        for (let i = 0; i < this.healthIcons.length; i++) {
            if (i < this.maxHealth) {
                this.healthIcons[i].setTexture('healthFilled');
            } else {
                this.healthIcons[i].setTexture('healthEmpty');
            }
        }
    }

    InforPanel() {
        let infoIcon = this.add.image(50, 25, 'infoIcon')
            .setOrigin(1, 0)
            .setScale(0.07)
            .setInteractive();

        let popupBg = this.add.image(180, 364, 'panelBg')
            .setDisplaySize(340, 500)
            .setOrigin(0.5)
            .setVisible(true);

        let titleText = this.add.text(180, 250, "How to Play", {
            fontFamily: 'lightgreen',
            fontSize  : '24px',
            fontStyle : 'bold',
            color     : '#ffffff',
            align     : 'center'
        }).setOrigin(0.5).setVisible(true);

        let popupText = this.add.text(180, 350, "- Compare the two images carefully\n\n- Tap the differences to spot them\n\n- Wrong taps reduce your health!",
            {
                fontFamily: 'lightgreen',
                fontSize  : '18px',
                color     : '#ffffff',
                align     : 'left',
                wordWrap  : { width: 360 }
            }).setOrigin(0.5).setVisible(true);

        let finleText = this.add.text(180, 450, "Good luck!", {
            fontFamily: 'lightgreen',
            fontSize  : '24px',
            fontStyle : 'bold',
            color     : '#ffffff',
            align     : 'center'
        }).setOrigin(0.5).setVisible(true);

        let closeButton = this.add.image(320, 240, "closeIcon")
            .setOrigin(1, 0)
            .setScale(0.05)
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
                  // this.fetchDifferenceImages();
            }
            this.isPanelClosed = false;
        });
    }

    imagesGenarate() {
        let orginleImage = this.add.image(85, 350, 'orginleImage')
            .setInteractive()
            .setDisplaySize(150, 300)
            .setOrigin(0.5, 0.5);

        let fakeimage = this.add.image(270, 350, 'staticImageOne')
            .setInteractive()
            .setDisplaySize(150, 300)
            .setOrigin(0.5, 0.5);

        this.differenceImages.forEach((imageKey) => {
            let diffImage = this.add.image(270, 350, imageKey)
                .setInteractive()
                .setDisplaySize(150, 300)
                .setOrigin(0.5, 0.5);

            this.differenceObjects.push(diffImage);

            diffImage.on('pointerdown', (pointer, localX, localY) => {
                this.checkAllDifferences(localX, localY, pointer);
            });
        });
    }

    checkAllDifferences(x, y, pointer) {
        console.log(`Checking all layers at X: ${x}, Y: ${y}`);

        let foundAny = false;

        this.differenceObjects.forEach((layer) => {
            let pixelData = this.textures.getPixel(x, y, layer.texture.key);

            if (pixelData && pixelData.a > 0) {
                console.log(`Found difference in ${layer.texture.key} at X: ${x}, Y: ${y}`);

                if (layer.texture.key.includes("difference")) {
                    const spotCircleImage = this.add.image(pointer.worldX, pointer.worldY, 'spotCircleImage')
                        .setOrigin(0.5, 0.5)
                        .setScale(0);

                    this.sound.add('correct').play({ volume: 0.5 });

                    if (!this.clickedDifferences.has(layer.texture.key)) {
                        this.tweens.add({
                            targets   : spotCircleImage,
                            scaleX    : 0.07,
                            scaleY    : 0.07,
                            alpha     : 1,
                            duration  : 250,
                            ease      : 'Linear',
                            onComplete: () => { }
                        });

                        this.currentDifferences++;
                        this.progressText.setText(`${this.currentDifferences} / ${this.maxDifferences}`);
                        this.clickedDifferences.add(layer.texture.key);

                        if (this.currentDifferences == this.maxDifferences) {
                            this.resetGameData();
                            this.time.delayedCall(750, () => {
                                this.scene.start('PlayerWon');
                            });
                        }
                    }
                }

                foundAny = true;
            }
        });

        if (!foundAny) {
            console.log("No non-transparent pixels found on any layer.");

            const wrongPick = this.add.image(pointer.worldX, pointer.worldY, 'wrongPick')
                .setOrigin(0.5, 0.5)
                .setScale(0);
            this.sound.add('wrong').play({ volume: 0.5 });

            this.tweens.add({
                targets   : wrongPick,
                scaleX    : 0.07,
                scaleY    : 0.07,
                alpha     : 1,
                duration  : 250,
                ease      : 'Linear',
                onComplete: () => {
                    this.time.delayedCall(500, () => {
                        this.tweens.add({
                            targets : wrongPick,
                            scaleX  : 0,
                            scaleY  : 0,
                            alpha   : 0.5,
                            duration: 250,
                            ease    : 'Linear',
                        });
                    });
                }
            });

            this.maxHealth--;
            console.log(`Player health: ${this.maxHealth}`);
            this.updateHealthIcons();
            if (this.maxHealth == 0) {
                this.resetGameData();
                this.time.delayedCall(750, () => {
                    this.scene.start('PlayerLost');
                });
            }
        }
    }

      /*  async fetchDifferenceImages() {
         console.log("Data fetching method calling");
 
         try {
             const docRef  = doc(this.db, 'gameAssets', 'differenceImages');
             const docSnap = await getDoc(docRef);
 
             if (docSnap.exists()) {
                 this.differenceImages = docSnap.data().Name;
                 console.log("Difference images fetched:", this.differenceImages[0]);
             } else {
                 console.log("No such document!");
             }
         } catch (error) {
             console.error("Error fetching difference images:", error);
         }
     } */

    resetGameData() {
        this.clickedDifferences.clear();
        this.currentDifferences = 0;
        console.log('Game data has been reset!');
    }
}