// 因为蛇需要每一帧都画出来，所以需要从AcGameObject中继承过来
import { AcGameObject } from "./AcGameObject";
import { Cell } from "./Cell";

export class Snake extends AcGameObject{
    constructor(info, gamemap){
        super();  //先调用基类构造

        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;

        this.cells = [new Cell(info.r, info.c)];  //存放蛇的身体，cells[0]存放蛇头
        this.next_cell = null;  //下一步的目标位置

        this.speed = 5;  //蛇每秒走5个格子
        this.direction = -1;  //-1表示没有指令，0、1、2、3表示上右下左
        this.status = "idle";  //idle表示静止， move表示正在移动， die表示死亡

        this.dr = [-1, 0, 1, 0];  //4个方向行的偏移量
        this.dc = [0, 1, 0, -1];  //4个方向列的偏移量

        this.turn = 0;  //表示回合数
        this.eps = 1e-2;

        this.eye_direction = 0;
        if(this.id === 1) this.eye_direction = 2;  //左下角的蛇眼睛初始朝上，右上角的蛇眼睛初始朝下

        //打个表存储蛇不同方向的眼睛偏移量（这里坐标y总说是右边是x正半轴，下面是y的正半轴，不太懂为什么）
        this.eye_dx = [  //蛇眼睛不同方向的x的偏移量
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1],
        ];

        this.eye_dy = [  //蛇眼睛不同方向的y的偏移量
            [-1, -1],
            [-1, 1],
            [1, 1],
            [-1, 1],
        ];
    }

    start(){
        
    }

    set_direction(d){  //设置蛇方向的统一接口函数
        this.direction = d;
    }

    check_tail_increasing(){  //检测当前回合，蛇的长度是否增加
        if(this.turn <= 10) return true;
        if(this.turn%3 === 1) return true;
        return false;
    }

    next_turn(){  //将蛇的状态变为走下一步
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.eye_direction = d;
        this.direction = -1;  //清空操作
        this.status = "move";
        this.turn ++;

        const k = this.cells.length;
        for(let i=k; i>0; i--){
            // 先转换成Json再把它解析出来就深层复制一遍，如果直接this.cells[i] = this.cells[i-1]直接赋值是赋引用，相互会有干扰
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i-1]));
        }

        if(!this.gamemap.check_valid(this.next_cell)){  //下一步操作撞了，蛇瞬间去世
            this.status = "die";
        }
    }

    update_move(){
        //const move_distance = this.speed * this.timedelta/1000;  //每两帧之间可以移动的距离
        const dx = this.next_cell.x - this.cells[0].x;  //目标点的坐标减去蛇头点的坐标
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx*dx + dy*dy);  //算出欧几里得距离

        if(distance < this.eps){  //小于这个人为设定的误差eps（这里为0.01）就判定为重合，即走到目标点了
            this.cells[0] = this.next_cell;  //移动完之后把移动到的点作为新的蛇头
            this.next_cell = null;
            this.status = "idle";  //走完了，停下来

            if(!this.check_tail_increasing()){  //蛇不变长的话就砍掉蛇尾
                this.cells.pop();
            }
        } else {  //如果不重合就移动
            const move_distance = this.speed * this.timedelta/1000;  //每两帧之间可以移动的距离
            this.cells[0].x += move_distance*dx/distance;
            this.cells[0].y += move_distance*dy/distance;

            if(!this.check_tail_increasing()){  // 如果蛇尾不变长的话
                const k = this.cells.length;
                const tail = this.cells[k-1], tail_target = this.cells[k-2];  //需要把蛇尾 tail 移动到 tail_target
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_dy / distance;
            }
        }
    }

    update(){  //每一帧执行一次
        if(this.status === 'move'){
            this.update_move();
        }

        this.render();
    }

    render(){
        const L = this.gamemap.L;  //取出每个单元格的长度
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;  //定义颜色
        if(this.status === "die"){
            ctx.fillStyle = "white";
        }

        for(const cell of this.cells){  // of 遍历值，in 遍历下标
            ctx.beginPath();  //画圆
            ctx.arc(cell.x*L, cell.y*L, L/2*0.8, 0, Math.PI*2);  //圆弧前两个参数是每一个小圆的中点，第三个是圆的半径，第四第五个参数是圆弧起始角度跟终止角度，这里L/2*0.8是为了给蛇瘦身
            ctx.fill();
        }

        for(let i=1; i<this.cells.length; i++){  //对蛇之间的空隙进行矩形填充
            const a = this.cells[i-1], b = this.cells[i];
            if(Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) continue;
            if(Math.abs(a.x - b.x) < this.eps){  //竖直方向进行填充
                ctx.fillRect((a.x - 0.5 + 0.1) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
            } else {  //横方向进行填充
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.5 + 0.1) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }

        ctx.fillStyle = "black";
        for(let i=0; i<2; i++){
            // 蛇头中点 + 蛇眼睛偏移量，最后*L转化成绝对距离
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;
            ctx.beginPath();
            // 这里*0.06可以改变眼珠子大小
            ctx.arc(eye_x, eye_y, L*0.06, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}