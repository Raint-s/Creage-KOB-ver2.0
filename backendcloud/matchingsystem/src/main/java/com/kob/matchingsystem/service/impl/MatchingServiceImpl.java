package com.kob.matchingsystem.service.impl;

import com.kob.matchingsystem.service.MatchingService;
import com.kob.matchingsystem.service.impl.utils.MatchingPool;
import org.springframework.stereotype.Service;



/*
Backend会通过OnMessage接收到匹配请求，然后通过状态判断向微服务MatchingSystem的30001端口发送不同的链接以确定是继续匹配还是取消匹配
然后MachtingSystem会由一个独立的线程MatchingPool，它会将接收到的用户放入匹配池当中，通过每秒循环一次匹配查询来查询匹配结果，然后将结果通过发送到3000端口发送回给Backend
Backend成功匹配后会在WebSocketServer中通过game.start()创建一个Game线程，然后会在Game类中创建一个gamemap，然后通过websocket返回给前端展示
下一步就是等待用户的输入（可以是keyboard输入，也可以是Bot输入），这一步不断循环判断赛局状况，如果status不为finish则一直循环下一步的状态直至Judge判断结束为止
 */
@Service
public class MatchingServiceImpl implements MatchingService {
    public final static MatchingPool matchingPool = new MatchingPool();

    @Override
    public String addPlayer(Integer userId, Integer rating, Integer botId) {
        System.out.println("add player: " + userId + " " + rating);
        matchingPool.addPlayer(userId, rating, botId);
        return "add player success";
    }

    @Override
    public String removePlayer(Integer userId) {
        System.out.println("remove player: " + userId);
        matchingPool.removePlayer(userId);
        return "remove player success";
    }
}
