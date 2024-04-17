// 创建一个动画的公共基类

// 存储所有游戏对象
const AC_GAME_OBJECTS = [];

// 需要把这个基类AcGameObject export出去，供给其他类引用
export class AcGameObject {
    constructor(){
        AC_GAME_OBJECTS.push(this);

        //因为帧与帧之间可能存在不同，所以要设置一个时间间隔的概念来统一
        this.timedelta = 0;

        //判断有没有执行过，初始化为没有执行过
        this.has_called_start = false;
    }

    start() {  //只执行一次

    }

    update() {  //每一帧执行一次，除了第一帧之外

    }

    on_destroy(){  //删除之前执行

    }

    destroy(){
        //删除之前调用一下就实现了删除之前执行
        this.on_destroy();

        for(let i in AC_GAME_OBJECTS){
            const obj = AC_GAME_OBJECTS[i];
            if(obj === this){
                //删除一个对象
                AC_GAME_OBJECTS.splice(i);
                break;
            }
        }
    }
}

let last_timestamp;  //上一次执行的时刻

// timestamp 是由 requestAnimationFrame 传给回调函数的，表示回调队列被触发的时间
const step = timestamp => {  //函数传入timestamp，即当前函数执行的时刻
    for(let obj of AC_GAME_OBJECTS){  //of遍历的是值，in遍历的是下标
        if(!obj.has_called_start){  //没执行过第一帧的话
            obj.has_called_start = true;
            obj.start();
        } else{
            obj.timedelta = timestamp - last_timestamp;  //存储这一帧跟上一帧之间的时间间隔，这里就是算出间隔的地方
            obj.update();
        }
    }

    last_timestamp = timestamp;
    //在下一帧的时候执行step函数
    requestAnimationFrame(step)
}

// 浏览器有一个函数，可以传入一个回调函数。这个函数是在下一帧浏览器渲染之前执行一遍，如果每一帧都执行那就写成一个迭代函数
requestAnimationFrame(step)