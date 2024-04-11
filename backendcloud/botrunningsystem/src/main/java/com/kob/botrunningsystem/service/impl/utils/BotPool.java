package com.kob.botrunningsystem.service.impl.utils;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class BotPool extends Thread{
    private final static ReentrantLock lock = new ReentrantLock();  // 这里加不加static都可以，因为是单例模式
    private final Condition condition = lock.newCondition();  // 唤醒线程的环境变量
    private final Queue<Bot> bots = new LinkedList<>();

    public void addBot(Integer userId, String botCode, String input) {  // 加任务（生产者）
        lock.lock();
        try {
            bots.add(new Bot(userId, botCode, input));
            condition.signalAll();  // 加完之后记得唤醒正在await的线程
        } finally {
            lock.unlock();
        }
    }

    private void consume(Bot bot) {  //
        Consumer consumer = new Consumer();
        consumer.startTimeout(2000, bot);
    }

    @Override
    public void run() {
        while(true) {
            lock.lock();
            if(bots.isEmpty()) {  // 如果当前队列是空的, 则需要将当前线程阻塞
                try {
                    condition.await();  // 睡了就会默认释放锁
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    lock.unlock();
                    break;
                }
            } else {  // 不空就会跳到这里，取出对头然后编译执行代码
                Bot bot = bots.remove();  // 取出队头
                lock.unlock();
                consume(bot);  // 编译并执行代码比较耗时，要放到加锁后
            }
        }
    }
}
