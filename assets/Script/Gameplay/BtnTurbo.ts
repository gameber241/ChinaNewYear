import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { GameManager } from './GameManager';
import { Sound } from '../Sound';
const { ccclass, property } = _decorator;

@ccclass('BtnTurbo')
export class BtnTurbo extends Component {
    @property(Sprite) icon: Sprite = null
    @property(SpriteFrame) icons: SpriteFrame[] = []



    onClick() {
        if (GameManager.instance.turboMode == 0) {
            Sound.instance.PlayTurbo1()
            GameManager.instance.turboMode = 1
            this.icon.spriteFrame = this.icons[1]
        }
        else {
            if (GameManager.instance.turboMode == 1) {
                Sound.instance.PlayTurbo2()
                GameManager.instance.turboMode = 2
                this.icon.spriteFrame = this.icons[2]
            }
            else {
                if (GameManager.instance.turboMode == 2) {
                    GameManager.instance.turboMode = 0
                    this.icon.spriteFrame = this.icons[0]
                }
            }
        }
    }
}

