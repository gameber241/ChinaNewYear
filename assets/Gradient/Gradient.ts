import {
  _decorator,
  Texture2D,
  Color,
  Vec2,
  Vec3,
  Size,
  UITransform,
  UIOpacity,
  Sprite,
  Material,
  CCBoolean,
  UIRenderer,
  Vec4,
  isValid,
} from "cc";
import { EDITOR } from "cc/env";
import { CustomShader } from "./CustomShader";


const { ccclass, property, executeInEditMode } = _decorator;

@ccclass
@executeInEditMode
export class Gradient extends CustomShader {
  @property({ serializable: true })
  private _gradientTex: Texture2D = null;
  @property({
    type: Texture2D,
    tooltip: "Gradient texture to be used.\nThis takes priority of colors.",
  })
  public set gradientTex(value: Texture2D) {
    this._gradientTex = value;
    this.updateMaterial();
  }
  public get gradientTex(): Texture2D {
    return this._gradientTex;
  }

  @property({ serializable: true })
  private _startColor: Color = new Color(Color.WHITE);
  @property({
    type: Color,
    tooltip: "Start color of the gradient",
    visible: function (this: Gradient) {
      return this.editorColorsAreUsed();
    },
  })
  public set startColor(value: Color) {
    this._startColor = value;
    this.updateMaterial();
  }
  public get startColor(): Color {
    return this._startColor;
  }

  @property({ serializable: true })
  private _endColor: Color = new Color(Color.BLUE);
  @property({
    type: Color,
    tooltip: "End color of the gradient",
    visible: function (this: Gradient) {
      return this.editorColorsAreUsed();
    },
  })
  public set endColor(value: Color) {
    this._endColor = value;
    this.updateMaterial();
  }
  public get endColor(): Color {
    return this._endColor;
  }

  @property({ serializable: true })
  private _startPos: Vec2 = new Vec2(0, 0.5);
  @property({
    type: Vec2,
    tooltip:
      "Start position of the gradient, used to calculate gradient direction, left top point is 0 0",
    visible: function (this: Gradient) {
      return this.editorColorsAreUsed();
    },
  })
  public set startPos(value: Vec2) {
    this._startPos = value;
    this.updateMaterial();
  }
  public get startPos(): Vec2 {
    return this._startPos;
  }

  @property({ serializable: true })
  private _endPos: Vec2 = new Vec2(1, 0.5);
  @property({
    type: Vec2,
    tooltip:
      "End position of the gradient, used to calculate gradient direction, right bottom point is 1 1",
    visible: function (this: Gradient) {
      return this.editorColorsAreUsed();
    },
  })
  public set endPos(value: Vec2) {
    this._endPos = value;
    this.updateMaterial();
  }
  public get endPos(): Vec2 {
    return this._endPos;
  }

  @property({ serializable: true })
  private _useMiddleColor: boolean = false;
  @property({
    type: CCBoolean,
    tooltip: "If a 3rd middle color should be used",
    visible: function (this: Gradient) {
      return this.editorColorsAreUsed();
    },
  })
  public set useMiddleColor(value: boolean) {
    this._useMiddleColor = value;
    this.updateMaterial();
  }
  public get useMiddleColor(): boolean {
    return this._useMiddleColor;
  }

  @property({ serializable: true })
  private _middleColor: Color = new Color(Color.YELLOW);
  @property({
    type: Color,
    tooltip: "Middle color of the gradient",
    visible: function (this: Gradient) {
      return this.editorShowMiddleColor();
    },
  })
  public set middleColor(value: Color) {
    this._middleColor = value;
    this.updateMaterial();
  }
  public get middleColor(): Color {
    return this._middleColor;
  }

  @property({ serializable: true })
  private _middlePos: number = 0.5;
  @property({
    slide: true,
    min: 0.0,
    max: 1.0,
    tooltip: "Position of middle color on gradient direction (between 0 and 1)",
    visible: function (this: Gradient) {
      return this.editorShowMiddleColor();
    },
  })
  public set middlePos(value: number) {
    this._middlePos = value;
    this.updateMaterial();
  }
  public get middlePos(): number {
    return this._middlePos;
  }

  @property({
    tooltip: "If the Node opacity should be affected by the HACK or not",
  })
  affectNodeOpacity: boolean = true;

  protected effectPath: string = "db://assets/Shader/Gradient/Gradient.effect";

  private editorColorsAreUsed(): boolean {
    return this.gradientTex == null;
  }

  private editorShowMiddleColor(): boolean {
    return this.editorColorsAreUsed() && this.useMiddleColor;
  }

  protected onLoad(): void {
    this.calcWorldPosChangeReq = true;
    super.onLoad();
  }

  protected onNodeSizeChanged(): void {
    if (this.haveCorrectEffect) {
      let _contentSize: Size = this.node.getComponent(UITransform).contentSize;
      let _size: Vec2 = new Vec2(_contentSize.width, _contentSize.height);
      this.material.setProperty("nodeSize", _size);

      this.onNodePositionChanged();
    }
  }

  protected onNodePositionChanged(): void {
    if (this.haveCorrectEffect) {
      let _contentSize: Size = this.node.getComponent(UITransform).contentSize;
      let _contentPos: Vec3 = this.node.parent
        .getComponent(UITransform)
        .convertToWorldSpaceAR(this.node.getPosition());
      _contentPos.x -=
        this.node.getComponent(UITransform).anchorX * _contentSize.width;
      _contentPos.y -=
        this.node.getComponent(UITransform).anchorY * _contentSize.height;
      let _offset: Vec2 = new Vec2(_contentPos.x, _contentPos.y);
      this.material.setProperty("nodeOffset", _offset);
    }
  }

  protected initMaterial(): void {
    this.material = new Material();
    // let useTexture = this.sprite != null ;
    if (this.gradientTex) {
      this.material.initialize({
        effectAsset: this.effect,
        defines: {
          USE_TEXTURE: true,
          USE_GRADIENT_TEXTURE: true,
          USE_GRADIENT_COLORS: false,
        },
      });
    } else {
      this.material.initialize({
        effectAsset: this.effect,
        defines: {
          USE_TEXTURE: true,
          USE_GRADIENT_TEXTURE: false,
          USE_GRADIENT_COLORS: true,
          USE_EXTRA_COLOR: this.useMiddleColor,
        },
      });
    }
    this.renderer.customMaterial = this.material;
    this.material.addRef();
  }

  protected updateMaterial(): void {
    if (!isValid(this.node, true) || !isValid(this.node.getComponent(UIRenderer), true)) return;
    this.material = this.node.getComponent(UIRenderer).customMaterial;
    if (this.haveCorrectEffect) {
      if (this.gradientTex) {
        this.material.setProperty("gradientTex", this.gradientTex);
      } else {
        let _startA: number = this.startColor.a;
        let _endA: number = this.endColor.a;
        let _midA: number = this.middleColor.a;
        // HACK: if all gradient colors have same opacity and source blend factor is not src_alpha then set node opacity
        // this issue should be fixed from shader or from texture
        /*if (this.affectNodeOpacity) {
                    if (this.sprite && this.sprite.srcBlendFactor != cc.macro.BlendFactor.SRC_ALPHA) {
                        if (_startA == _endA && (!this.useMiddleColor || _startA == _midA)) {
                            this.node.getComponent(UIOpacity).opacity = _startA;
                            _startA = _endA = _midA = 255.0;
                        }
                    }
                }*/
        //@ts-ignore
        this.material.setProperty(
          "startColor",
          new Vec4(
            this.startColor.r / 255.0,
            this.startColor.g / 255.0,
            this.startColor.b / 255.0,
            _startA / 255.0
          )
        );

        this.material.setProperty(
          "endColor",
          new Vec4(
            this.endColor.r / 255.0,
            this.endColor.g / 255.0,
            this.endColor.b / 255.0,
            _endA / 255.0
          )
        );

        this.material.setProperty("startPos", this.startPos);
        this.material.setProperty("endPos", this.endPos);
        if (this.useMiddleColor) {
          this.material.setProperty(
            "middleColor",
            new Vec4(
              this.middleColor.r / 255.0,
              this.middleColor.g / 255.0,
              this.middleColor.b / 255.0,
              _midA / 255.0
            )
          );
          this.material.setProperty("middlePos", this.middlePos);
        }
      }
    }
  }
}
