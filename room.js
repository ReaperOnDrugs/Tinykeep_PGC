import POINT from "./point.js";

export default class ROOM {
    constructor(_POINT) {
        this.point = _POINT;
        let x = _POINT.x;
        let y = _POINT.y;
        this.height = Math.floor((Math.random() % 10)) + 5;
        this.width = Math.floor((Math.random() % 10)) + 5;
        this.start_point = new POINT(x - this.width, y - this.height);
        this.end_point = new POINT(x + this.width*2, y + this.height*2);
    }

    update_coords() {
        this.start_point = new POINT(this.point.x - this.width, this.point.y - this.height);
        this.end_point = new POINT(this.point.x + this.width*2, this.point.y + this.height*2);
    }
}