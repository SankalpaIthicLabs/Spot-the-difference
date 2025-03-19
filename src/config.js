import Phaser from 'phaser';
import { MainMenu } from './scenes/mainMenu.js';
import { PlayerWon } from './scenes/playerWon.js';
import { PlayerLost } from './scenes/playerLoss.js';
import { GamePlayScene } from './scenes/gamePlayScene.js';
import { BootScene } from './scenes/bootscene.js';


//#endregion
export const config = {
  type: Phaser.WEBGL,
  width: 360,
  height: 640,
  scene: [BootScene,MainMenu,GamePlayScene,PlayerWon,PlayerLost],
  canvas: gameCanvas,
};

const game = new Phaser.Game(config);


