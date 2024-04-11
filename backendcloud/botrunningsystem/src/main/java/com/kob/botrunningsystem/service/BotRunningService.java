package com.kob.botrunningsystem.service;

public interface BotRunningService {
    String addBot(Integer userId, String botCode, String input);  // 归属的userid，需要执行的代码，输入当前游戏相关的信息比如：地图信息，走过的格子等
}
