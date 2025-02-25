import Phaser from 'phaser';
import { MainMenu } from './mainMenu';
import { PlayerWon } from './playerWon';
import { PlayerLost } from './playerLoss';
import { GamePlayScene } from './gamePlayScene';

//#endregion
export const config = {
  type: Phaser.WEBGL,
  width: 420,
  height: 728,
  scene: [MainMenu,GamePlayScene,PlayerWon,PlayerLost],
  canvas: gameCanvas,
};

const game = new Phaser.Game(config);


