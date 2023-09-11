type Keys = {
  right: { pressed: boolean };
  left: { pressed: boolean };
};
type Vector2 = {
  x: number;
  y: number;
};
type Size = {
  width: number;
  height: number;
};
type Sprites = {
  stand: {
    right: HTMLImageElement;
    left: HTMLImageElement;
  };
  run: {
    right: HTMLImageElement;
    left: HTMLImageElement;
  };
};
type StringImageAssets = {
  mainMenu: {
    background: string;
    play: string;
  };
  character: {
    characterMoveLeft: string;
    characterMoveRight: string;
    characterStandLeft: string;
    characterStandRight: string;
  };
  background: string;
  finish: string;
  life: string;
  platform: string;
};
type CharacterAssets = {
  characterMoveLeft: HTMLImageElement;
  characterMoveRight: HTMLImageElement;
  characterStandLeft: HTMLImageElement;
  characterStandRight: HTMLImageElement;
};
type ImageAssets = {
  mainMenu: {
    background: HTMLImageElement;
    play: HTMLImageElement;
  };
  character: CharacterAssets;
  background: HTMLImageElement;
  finish: HTMLImageElement;
  life: HTMLImageElement;
  platform: HTMLImageElement;
};
type GameAssets = {
  gravity: number;
  playerSpeed: number;
  playerJump: number;
  platformSpeed: number;
  genericObjectSpeed: number;
  winingLength: number;
};
