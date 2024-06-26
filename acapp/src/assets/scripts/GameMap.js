// 游戏里每一个组件都是一个类
// 此处的游戏地图的类


/* 在js里有时候import需要加{}，有时候不用
区别是：如果是export出来的，那么import需要{}，如果是export default那么就不用{}
每个文件最多只能export一个default，类似于java里面的public */

import { AcGameObject } from "./AcGameObject";
import { Wall } from "./Wall";
import { Snake } from "./Snake";
// import { event } from "jquery";

// 这个地图类也需要export出去给别的类用
export class GameMap extends AcGameObject {
    // 构造传入画布ctx以及父元素parent方便动态修改长宽
    constructor(ctx, parent, store){
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.store = store;
        this.L = 0;  // L表示1个单位长度，整个地图为n*n个单位

        this.rows = 13;  //这里行列设置不一是为了避免两条蛇同一时间可以进入同一个格子的情况，因为一个坐标和是 偶->奇->偶， 另一个坐标和是 奇->偶->奇
        this.cols = 14;

        this.inner_walls_count = 20;
        this.walls = [];

        this.snakes = [
            // 创建蛇的信息，并把当前地图的引用this（当前是GameMap类，所以是当前地图）传过去
            new Snake({id:0, color:"#4876EC", r:this.rows-2, c:1}, this),
            new Snake({id:1, color:"#F94848", r:1, c:this.cols-2}, this),
        ]

    }

    // FloodFill判断地图连通性
    // check_connectivity(g, sx, sy, tx, ty){  //sx:source x，源x   tx:target x，目标x
    //     if(sx==tx && sy==ty) return true;
    //     g[sx][sy] = true;

    //     let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
    //     for(let i=0; i<4; i++){
    //         let x = sx + dx[i], y = sy + dy[i];
    //         // 没有撞墙并且可以到终点那么就返回true
    //         if(!g[x][y] && this.check_connectivity(g, x, y, tx, ty))
    //             return true;
    //     }

    //     return false;
    // }

    // create_walls(){
    //     const g = [];
    //     for(let r=0; r<this.rows; r++){
    //         g[r] = [];  //每一行都赋一个数组
    //         for(let c=0; c<this.cols; c++){
    //             g[r][c] = false;
    //         }
    //     }

    //     //给四周加上障碍物
    //     for(let r=0; r<this.rows; r++){
    //         g[r][0] = g[r][this.cols-1] = true;
    //     }

    //     for(let c=0; c<this.cols; c++){
    //         g[0][c] = g[this.rows-1][c] = true;
    //     }

    //     //创建随机障碍物
    //     for(let i=0; i<this.inner_walls_count/2; i++){
    //         for(let j=0; j<1000; j++){
    //             let r = parseInt(Math.random()*this.rows);
    //             let c = parseInt(Math.random()*this.cols);

    //             /* 轴对称写法：if(g[r][c] || g[c][r]) continue;
    //             因为改成长方形了，所以轴对称需要改成中心对成 */
    //             if(g[r][c] || g[this.rows-1-r][this.cols-1-c]) continue;

    //             if(r==this.cols-2 && c==1 || r==1 && c==this.cols-2) continue;

    //             /*轴对称写法
    //             g[r][c] = g[c][r] = true;
    //             */
    //             g[r][c] = g[this.rows-1-r][this.cols-1-c] = true;
    //             break;
    //         }
    //     }

    //     const copy_g = JSON.parse(JSON.stringify(g));
    //     if(!this.check_connectivity(copy_g, this.rows-2, 1, 1, this.cols-2)) return false;

    //     for(let r=0; r<this.rows; r++){
    //         for(let c=0; c<this.cols; c++){
    //             if(g[r][c]){
    //                 this.walls.push(new Wall(r, c, this));
    //             }
    //         }
    //     }

    //     return true;
    // }

    create_walls(){
        const g = this.store.state.pk.gamemap;

        for(let r=0; r<this.rows; r++){
            for(let c=0; c<this.cols; c++){
                if(g[r][c]){
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
    }


    add_listening_events(){
        if(this.store.state.record.is_record) {  // 如果是录像的话就根据历史存储的操作步骤将每一步操作回放出来
            let k = 0;
            const a_steps = this.store.state.record.a_steps;
            const b_steps = this.store.state.record.b_steps;
            const loser = this.store.state.record.record_loser;
            const [snake0, snake1] = this.snakes;
            const interval_id = setInterval(() => {  // 每300ms放回放
                if(k >= a_steps.length - 1) {  // 最后一步撞了，不需要放出最后一步
                    if(loser === "all" || loser === "A") {
                        snake0.status = "die";
                    }
                    if(loser === "all" || loser === "B") {
                        snake1.status = "die";
                    }
                    clearInterval(interval_id);
                } else {
                    snake0.set_direction(parseInt(a_steps[k]));
                    snake1.set_direction(parseInt(b_steps[k]));
                }
                k++;  // 每次循环完之后 k++
            }, 300);
        } else {  // 如果是对战那么逻辑跟之前一样
            this.ctx.canvas.focus();  //为了让canvas可以获取用户输入则必须聚焦canvas

            // const [snake0, snake1] = this.snakes;
            this.ctx.canvas.addEventListener("keydown", e => {
                let d = -1;
                if(e.key === 'w') d = 0;
                else if(e.key === 'd') d = 1;
                else if(e.key === 's') d = 2;
                else if(e.key === 'a') d = 3;

                if(d >= 0) {
                    this.store.state.pk.socket.send(JSON.stringify({
                        event: "move",
                        direction: d,
                    }));
                }
                // else if(e.key === 'ArrowUp') snake1.set_direction(0);
                // else if(e.key === 'ArrowRight') snake1.set_direction(1);
                // else if(e.key === 'ArrowDown') snake1.set_direction(2);
                // else if(e.key === 'ArrowLeft') snake1.set_direction(3);
            });
        }
    }

    start() {
        // for(let i=0; i<1000; i++)
        //     if(this.create_walls()) break;
        this.create_walls();

        this.add_listening_events();
    }

    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth/this.cols, this.parent.clientHeight/this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready(){  //判断两条蛇是否都准备好下一回合了
        for(const snake of this.snakes){
            if(snake.status !== "idle") return false;
            if(snake.direction === -1) return false;
        }
        return true;
    }

    next_turn(){  //让两条蛇进入下一回合
        for(const snake of this.snakes){
            snake.next_turn();
        }
    }

    check_valid(cell){  //检测目标位置是否合法：没有撞到两条蛇的身体和障碍物
        for(const wall of this.walls){
            if(wall.r === cell.r && wall.c === cell.c)
                return false;
        }

        for(const snake of this.snakes){
            let k = snake.cells.length;
            if(!snake.check_tail_increasing()){   //当蛇尾会前进的时候，蛇尾不要判断
                k--;
            }
            for(let i=0; i<k; i++){
                if(snake.cells[i].r === cell.r && snake.cells[i].c === cell.c)
                    return false;
            }
        }

        return true;
    }

    update() {
        this.update_size();
        if(this.check_ready()){
            this.next_turn();
        }
        this.render();
    }

    render() {
        const color_even = "#AAD751", color_odd = "#A2D149";
        for(let r=0; r<this.rows; r++)
            for(let c=0; c<this.cols; c++){
                if((r+c)%2 == 0){
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }

                // 前两个参数是左上角坐标，后面两个参数是边长
                this.ctx.fillRect(c*this.L, r*this.L, this.L, this.L);
            }
    }
}