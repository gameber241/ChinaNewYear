import { _decorator, Component, Sprite, Node, UITransform, Vec3, director, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingScene')
export class LoadingScene extends Component {

    @property(Sprite)
    loadingBar: Sprite = null!;

    @property(Node)
    icon: Node = null!;


    private barWidth: number = 0;
    private currentProgress: number = 0;
    private targetProgress: number = 0;

    onLoad() {
        this.barWidth = this.loadingBar.getComponent(UITransform)!.width;

        this.loadingBar.fillRange = 0;

        this.preloadGameScene();
    }

    preloadGameScene() {

        director.preloadScene("Gameplay",
            (completed, total) => {

                this.targetProgress = completed / total;

            },
            () => {

                this.targetProgress = 1;

            }
        );
    }

    update(dt: number) {

        // làm mượt progress
        this.currentProgress += (this.targetProgress - this.currentProgress) * 0.1;

        this.updateLoading(this.currentProgress);

        if (this.currentProgress >= 0.999) {
            this.currentProgress = 1;
            this.updateLoading(1);
        }
    }

    updateLoading(progress: number) {

        progress = Math.min(Math.max(progress, 0), 1);

        // update fill
        this.loadingBar.fillRange = progress;

        // update icon position
        let left = -this.barWidth / 2;
        let posX = left + this.barWidth * progress;

        this.icon.setPosition(new Vec3(posX, this.icon.position.y, 0));
    }

    onClickStart() {
        director.loadScene("Gameplay");
    }
}
