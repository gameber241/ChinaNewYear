
import {
  _decorator,
  Component,
  EffectAsset,
  Label,
  Sprite,
  Material,
  Vec3,
  UITransform,
  Node,
  resources,
  assetManager,
  warn,
  UIRenderer,
  sys,
} from "cc";
import { EDITOR } from "cc/env";

const { ccclass, property } = _decorator;

@ccclass
export class CustomShader extends Component {
  @property({ serializable: true })
  _effect: EffectAsset = null;
  @property(EffectAsset)
  public set effect(value: EffectAsset) {
    this._effect = value;
    this.updateEffect();
  }
  public get effect(): EffectAsset {
    return this._effect;
  }

  public get haveCorrectEffect(): boolean {
    return (
      this.material != null &&
      this.material.effectAsset != null &&
      this.material.effectAsset.name == this.effect.name
    );
  }

  protected effectPath: string = "";
  protected renderer: UIRenderer | null = null;
  protected label: Label | null = null;
  protected sprite: Sprite | null = null;
  protected material: Material | null  = null;
  protected calcWorldPosChangeReq: boolean = false;
  protected lastWorldPos: Vec3 = new Vec3(0, 0, 0);

  protected isInit = false; // [WEB-APP]

  protected onLoad(): void {
    if (EDITOR) {
      this.editor_updateEffectRef();
    } else {
      if (this.effect == null) this.enabled = false;
    }
  }

  protected onEnable(): void {
    this.init();
      // this is redundant but is a fix for when the component appear for the first time
      // for some reason node opacity is not considered sometimes in onEnable() when the component appear for the first time
      // this is Cocos bug
      // TODO: check with newer cocos version
      if (!sys.isBrowser && !this.isInit) {
        this.scheduleOnce(this.updateMaterial); // call init() again after 1 frame
        this.isInit = true;
      }

      if (this.calcWorldPosChangeReq)
          this.lastWorldPos = this.getWorldPos();
      this.node.on(Node.EventType.SIZE_CHANGED, this.onNodeSizeChanged, this);
  }

  protected onDisable(): void {
    this.node.off(Node.EventType.SIZE_CHANGED, this.onNodeSizeChanged, this);

    if (!this.enabled) {
      this.reset(true);
    }
  }

  protected onDestroy(): void {
    if (!EDITOR) {
      this.reset(false);
    }
  }

  public onRestore(): void {
    this.editor_updateEffectRef();
    this.init();
  }

  protected async editor_updateEffectRef(): Promise<void> {
    if (!this.effectPath || this.effect) return;
    let self = this;
    let uuid = await Editor.Message.request(
      "asset-db",
      "query-uuid",
      this.effectPath
    );
    assetManager.loadAny({ uuid: uuid }, (err, shader) => {
      if (err) {
        warn(err.message || err);
        return;
      }
      self.effect = shader as EffectAsset;
    });
  }


  protected update(dt: number): void {
    if (this.calcWorldPosChangeReq) {
      let currentWorldPos: Vec3 = this.getWorldPos();
      if (
        Math.abs(this.lastWorldPos.x - currentWorldPos.x) +
          Math.abs(this.lastWorldPos.y - currentWorldPos.y) >=
        1
      )
        this.onNodePositionChanged();
      this.lastWorldPos = currentWorldPos;
    }
  }

  protected getWorldPos(): Vec3 {
    if (this.node == null) return Vec3.ZERO;
    if (this.node.parent == null) return this.node.getPosition();
    return this.node.parent
      .getComponent(UITransform)
      .convertToWorldSpaceAR(this.node.getPosition());
  }

  protected init(): void {
    if (!this.enabled) return;
    if (this.renderer == null) {
      if (this.node == null) {
        this.destroy();
        return;
      }
      this.renderer = this.node.getComponent(UIRenderer);
      this.label = this.node.getComponent(Label);
      this.sprite = this.node.getComponent(Sprite);

      if (this.label) {
        if (
          this.label.cacheMode == Label.CacheMode.CHAR &&
          this.label.useSystemFont == false
        ) {
          this.label.cacheMode = Label.CacheMode.BITMAP;
        }
      }
    }
    this.updateEffect();
  }

  /**
   * change material back to default one (useful in editor) and release the created one from memory (useful in runtime)
   * @param setDefault should change material back to default one?
   */
  protected reset(setDefault: boolean): void {
    if (this.renderer) {
      if (this.haveCorrectEffect) {
        this.material.decRef(true);
        this.material.destroy();
        this.material = null;
      }

      if (setDefault) {
        this.renderer.customMaterial = null;
        //let engine re-create from builtin materials
        //@ts-ignore
        this.renderer.updateMaterial();
      }
    }
  }

  public forceUpdate(): void {
    this.updateEffect();
  }

  protected initMaterial(): void {
    this.material = new Material();
    this.material.initialize({
      effectAsset: this.effect,
      defines: { USE_TEXTURE: true },
    });
    this.renderer.customMaterial = this.material;
    this.material.addRef();
  }

  protected updateEffect(): void {
    if (this.effect) {
      if (this.material == null) {
        if (!this.renderer) return;
        this.initMaterial();
      } else {
        if (!this.renderer) return;
        if (this.renderer.customMaterial === null) {
          this.renderer.customMaterial = this.material;
        }
      }

      if (!this.haveCorrectEffect) {
        this.initMaterial();
      }

      this.onNodeSizeChanged();
      this.updateMaterial();
    } else {
      this.reset(true);
    }
  }

  protected onNodeSizeChanged(): void {}
  protected onNodePositionChanged(): void {}
  protected updateMaterial(): void {}
}
