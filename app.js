import POINT from "./point.js";
import ROOM from "./room.js";

// canvas stuff
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let C_SIZE
let UNIT

// element used for referencing canvas size when window resizes so it doesn't blur
let scaling_element = document.querySelector("#scaling_element");

// parameters
let spawn_radius = 10; // initial room spawning radius
let point_size = 0.5; // radius of a single point
let room_count = 6; // how many rooms to spawn

// elements
let points = new Array();
let rooms = new Array();

// run at load time
window.onload = () => {
    // get canvas size
    update_canvas_size();
    // listen for resizing
    window.addEventListener("resize", resized);
    
    // draw border around spawn radius
    //ctx.beginPath();
    //ctx.arc(53*UNIT, 53*UNIT, spawn_radius*UNIT, 0, 2*Math.PI);
    //ctx.stroke();
    //ctx.closePath();

    //draw_grid();

    // get points
    for (let i = 0; i < room_count; i++) {
        let point = random_point_in_circle();
        point.name = i;
        points.push(point);
    }

    create_rooms();

    separate_rooms();
    d();
}

function d() {
    draw_points();
    draw_rooms();
    ctx.strokeStyle = "#ef0000";
    draw_room(rooms[0]);
    ctx.strokeStyle = "#000";
}

// update canvas size info
function update_canvas_size() {
    canvas.setAttribute("height", scaling_element.clientHeight);
    canvas.setAttribute("width", scaling_element.clientHeight);
    C_SIZE = Math.floor(canvas.height);
    UNIT = Math.floor(C_SIZE / 100);
}
// run on window resize trigger
function resized() {
    update_canvas_size();
}

// redraw (tmp function)
function redraw(x, y, width, height) {
    ctx.fillStyle = "#000";
    ctx.fillRect(x*UNIT, y*UNIT, width*UNIT, height*UNIT);
}

// draw a point on canvas
function draw_point(point, color) {
    let prev_clr = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x*UNIT, point.y*UNIT, point_size*UNIT, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = prev_clr;
}
// draw all points in array
function draw_points() {
    for (let i=0; i < points.length; i++) {
        draw_point(points[i]);
    }
}

// get random point in spawn radius and return it as POINT object
function random_point_in_circle() {
    let angle = 2*Math.PI*Math.random();
    let dist = Math.random() + Math.random();
    let point_angle_value;
    let x_f, y_f;

    if (dist > 1)  point_angle_value = 2 - dist;
    else point_angle_value = dist;

    x_f = spawn_radius*point_angle_value*Math.cos(angle);
    x_f += 50;
    y_f = spawn_radius*point_angle_value*Math.sin(angle);
    y_f += 50;
    let point = new POINT(snap(x_f, UNIT), snap(y_f, UNIT));

    //point.x += 50;
    //point.y += 50;
    return point;
}

// snap values to grid
function snap(a, b) {
    return Math.floor(((a + b - 1)/b)*b);
}

// draw grid
function draw_grid() {
    ctx.beginPath();

    for (let i=0; i < 120; i++) {
        ctx.moveTo(i*UNIT, 0);
        ctx.lineTo(i*UNIT, C_SIZE);
        ctx.moveTo(0, i*UNIT);
        ctx.lineTo(C_SIZE, i*UNIT);
    }

    ctx.closePath();

    ctx.stroke();
}

function create_rooms() {
    for (let i=0; i < points.length; i++) {
        let room = new ROOM(points[i]);
        rooms.push(room);
    }
}

function draw_room(room) {
    ctx.strokeRect(room.start_point.x*UNIT, room.start_point.y*UNIT, room.width*2*UNIT, room.height*2*UNIT);
}

function draw_rooms() {
    for (let i=0; i < rooms.length; i++) {
        draw_room(rooms[i]);
    }
}

function separate_rooms() {
    for (let current=0; current < rooms.length; current++) {
        while (any_overlap(current)){
            let direction = new POINT(0, 0);
            let count = 0;
            for (let other=0; other < rooms.length; other++) {
                if (other == current) continue;
                if (check_overlap(rooms[current], rooms[other])) {
                    direction.x += rooms[other].point.x;
                    direction.y += rooms[other].point.y;
                    count++;
                }
            }
            console.log("----");
            console.log(count+" overlaps found");
            direction.x /= count;
            direction.y /= count;
            normalize(direction);
            console.log("dir");
            console.log(direction);
            shift_area(rooms[current], direction, 1);
        }
    }
    console.log(rooms[0]);
}

function any_overlap(room_index) {
    for (let current=0; current < rooms.length; current++) {
        if (room_index == current) continue;
        if (check_overlap(rooms[room_index], rooms[current])) return true;
    }
    return false;
}

function check_overlap(a1, a2) {
    if ((a1.start_point.x >= a2.end_point.x) ||
        (a2.start_point.x >= a1.end_point.x)) return false;
    if ((a1.end_point.y <= a2.start_point.y )||
        (a2.end_point.y <= a1.start_point.y)) return false;
    return true;
}

function shift_area(area, direction, inversion) {
    area.point.x = area.point.x + (direction.x*inversion);
    area.point.y = area.point.y + (direction.y*inversion);
    area.update_coords();
}

function normalize(vec) {
    let abs = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
    vec.x = vec.x / abs;
    vec.y = vec.y / abs;
}