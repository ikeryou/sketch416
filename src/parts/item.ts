import { MyDisplay } from "../core/myDisplay";
import { Util } from "../libs/util";
import { Func } from "../core/func";
import { Color, Vector3 } from "three";
import { Tween } from "../core/tween";
import { MousePointer } from "../core/mousePointer";

// -----------------------------------------
//
// -----------------------------------------
export class Item extends MyDisplay {

  private _pos:{
    x: number,
    y: number,
    z: number,
    scale: number,
    distX: number,
    distY: number
  }

  private _speed: Vector3 = new Vector3(0, 0, 0)
  private _fl: number = 4000
  private _scaleOffset: number = Util.random(10, 40)
  private _scaleOffset2: number = Util.random(4, 100)

  private _color1: Color = new Color(Util.random(0.5,1), Util.random(0,1), Util.random(0,1))
  private _color2: Color = new Color(Util.random(0.5,1), Util.random(0,1), Util.random(0,1))
  private _color3: Color = new Color(Util.random(0.5,1), Util.random(0,1), Util.random(0,1))
  private _color4: Color = new Color(Util.random(0.5,1), Util.random(0,1), Util.random(0,1))

  private _angle1: number = 0
  private _angle2: number = 0
  private _angle3: number = 0

  private _center: Vector3 = new Vector3(0, 0, 0)

  constructor(opt:any) {
    super(opt)

    const col = [
      new Color(0x275db5),
      new Color(0xed9536),
      new Color(0xe26448),
      new Color(0x4395d3),
      new Color(0xdd9e9c),
      new Color(0xcad3d9)
    ]
    Util.shuffle(col)
    this._color1 = col[0].clone()
    this._color2 = col[1].clone()
    this._color3 = col[2].clone()
    this._color4 = col[3].clone()

    this._pos = {
      x: 0,
      y: 0,
      z: 0,
      scale: 0,
      distX: 0,
      distY: 0
    }

    this._speed.x = Util.random2(1, 2)
    this._speed.y = Util.random2(1, 2)
    this._speed.z = Util.random2(1, 2)
  }


  // ----------------------------------------
  // X軸の回転
  // obj   : x,y,zの位置情報をもつオブジェクト
  // angle : 移動角度(ラジアン)
  // ----------------------------------------
  private _rotateX(angle: number):void  {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const y = this._pos.y * cos - this._pos.z * sin;
    const z = this._pos.z * cos + this._pos.y * sin;

    this._pos.y = y;
    this._pos.z = z;
  }

  // ----------------------------------------
  // Y軸の回転
  // obj   : x,y,zの位置情報をもつオブジェクト
  // angle : 移動角度(ラジアン)
  // ----------------------------------------
  private _rotateY(angle: number): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const x = this._pos.x * cos - this._pos.z * sin;
    const z = this._pos.z * cos + this._pos.x * sin;

    this._pos.x = x;
    this._pos.z = z;
  }

  // ----------------------------------------
  // Z軸の回転
  // obj   : x,y,zの位置情報をもつオブジェクト
  // angle : 移動角度(ラジアン)
  // ----------------------------------------
  private _rotateZ(angle: number): void {

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const x = this._pos.x * cos - this._pos.y * sin;
    const y = this._pos.y * cos + this._pos.x * sin;

    this._pos.x = x;
    this._pos.y = y;
  }


  // ----------------------------------------
  //
  // ----------------------------------------
  private _perspective(fl: number): void {
    this._pos.scale = fl / (fl + this._pos.z);
    this._pos.distX = this._center.x + this._pos.x * this._pos.scale;
    this._pos.distY = this._center.y + this._pos.y * this._pos.scale;
  }



  protected _update():void {
    super._update();

    const sw = Func.sw()
    const sh = Func.sh()
    const radius = Math.max(sw, sh) * 0.1
    const mx = MousePointer.instance.easeNormal.x
    const my = MousePointer.instance.easeNormal.y

    this._center.x = sw * 0.5 + Math.sin(this._c * 0.02 * this._speed.x) * radius
    this._center.y = sh * 0.5 + Math.sin(this._c * -0.032 * this._speed.y) * radius
    this._center.x += mx * radius * -3
    this._center.x += my * radius * -3


    this._rotateX(Util.radian(this._speed.x))
    this._rotateY(Util.radian(this._speed.y))
    this._rotateZ(Util.radian(this._speed.z))

    this._perspective(this._fl);

    const p1 = 0;
    const p2 = this._pos.scale * this._scaleOffset;
    const p3 = p2 + this._scaleOffset2;

    // const x = this._pos.distX;
    // const y = this._pos.distY;

    const color1 = this._color1.clone()
    const color2 = this._color2.clone()
    const color3 = this._color3.clone()

    color1.lerp(this._color2, Util.map(Math.sin(Util.radian(this._angle1)), 0, 1, -1, 1))
    color2.lerp(this._color3, Util.map(Math.sin(Util.radian(this._angle2)), 0, 1, -1, 1))
    color3.lerp(this._color4, Util.map(Math.sin(Util.radian(this._angle3)), 0, 1, -1, 1))

    // this._angle1 += this._speed.x * 1.5;
    // this._angle2 += this._speed.y * 2.3;
    this._angle3 += this._speed.z * 1.2;

    const r = 180
    this._angle1 = (this._speed.x * 180) + mx * r * this._speed.z
    this._angle2 = (this._speed.y * 180) + my * r * this._speed.z

    const lineWidth = 0.1
    const lineColor = new Color(0xffffff)
    const grad = 'linear-gradient(' + ((this._angle1 + this._angle2) * 0.2) + 'deg, ' + color1.getStyle() + ' ' + p1 + '%, ' + color2.getStyle() + ' ' + (p2 - lineWidth) + '%, ' + lineColor.getStyle() + ' ' + p2 + '%, ' + lineColor.getStyle() + ' ' + p2 + '%, ' + color3.getStyle() + ' ' + (p2 + lineWidth) + '%, ' + color2.getStyle() + ' ' + p3 + '%)'

    Tween.set(this.el, {
      backgroundImage: grad,
    })
  }
}







