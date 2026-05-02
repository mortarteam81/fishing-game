import Phaser from "phaser";
import "./style.css";
import { BootScene } from "./scenes/BootScene";
import { CatchResultScene } from "./scenes/CatchResultScene";
import { CharacterScene } from "./scenes/CharacterScene";
import { CollectionScene } from "./scenes/CollectionScene";
import { ExchangeScene } from "./scenes/ExchangeScene";
import { FishingScene } from "./scenes/FishingScene";
import { HarborScene } from "./scenes/HarborScene";
import { OceanScene } from "./scenes/OceanScene";
import { QuestScene } from "./scenes/QuestScene";
import { SaveScene } from "./scenes/SaveScene";
import { hydrateGameBackup } from "./game/storage";

function syncViewportHeight() {
  const height = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${height}px`);
}

function installMobileViewportFixes(game: Phaser.Game) {
  const refreshScale = () => {
    syncViewportHeight();
    window.setTimeout(() => game.scale.refresh(), 80);
  };

  syncViewportHeight();
  window.visualViewport?.addEventListener("resize", refreshScale);
  window.addEventListener("resize", refreshScale);
  window.addEventListener("orientationchange", refreshScale);
  document.addEventListener(
    "touchmove",
    (event) => {
      event.preventDefault();
    },
    { passive: false },
  );
}

function startGame() {
  const parent = document.querySelector<HTMLElement>("#app");
  if (!parent) {
    document.body.innerHTML = '<div class="fallback">게임을 시작할 공간을 찾지 못했어요.</div>';
    return;
  }

  const game = new Phaser.Game({
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
      CharacterScene,
      SaveScene,
    ],
  });

  installMobileViewportFixes(game);
}

void hydrateGameBackup().finally(startGame);
