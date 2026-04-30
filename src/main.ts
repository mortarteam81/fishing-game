import Phaser from "phaser";
import "./style.css";
import { BootScene } from "./scenes/BootScene";
import { CatchResultScene } from "./scenes/CatchResultScene";
import { CollectionScene } from "./scenes/CollectionScene";
import { ExchangeScene } from "./scenes/ExchangeScene";
import { FishingScene } from "./scenes/FishingScene";
import { HarborScene } from "./scenes/HarborScene";
import { OceanScene } from "./scenes/OceanScene";
import { QuestScene } from "./scenes/QuestScene";

const parent = document.querySelector<HTMLElement>("#app");

if (!parent) {
  document.body.innerHTML = '<div class="fallback">게임을 시작할 공간을 찾지 못했어요.</div>';
} else {
  new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: "#bdeedc",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 960,
      height: 540,
    },
    input: {
      activePointers: 2,
    },
    audio: {
      disableWebAudio: false,
    },
    scene: [
      BootScene,
      HarborScene,
      OceanScene,
      FishingScene,
      CatchResultScene,
      CollectionScene,
      ExchangeScene,
      QuestScene,
    ],
  });
}
