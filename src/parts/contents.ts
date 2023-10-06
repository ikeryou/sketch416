import { MyDisplay } from "../core/myDisplay";
import { Item } from "./item";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _item: Array<Item> = []

  constructor(opt:any) {
    super(opt)

    const num = 8
    for(let i = 0; i < num; i++) {
      const el = document.createElement('div')
      el.classList.add('js-item')
      this.el.prepend(el)

      // if(i === num - 1) {
      //   el.classList.add('-text')
      // }

      this._item.push(new Item({
        el: el,
        id: i,
        text: i === num - 1 ? 'SKETCH #415' : ''
      }))
    }
  }
}