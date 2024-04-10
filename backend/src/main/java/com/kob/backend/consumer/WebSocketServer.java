package com.kob.backend.consumer;

import com.alibaba.fastjson2.JSONObject;
import com.kob.backend.consumer.utils.Game;
import com.kob.backend.consumer.utils.JwtAuthentication;
import com.kob.backend.mapper.RecordMapper;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Iterator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@ServerEndpoint("/websocket/{token}")  // 链接映射，注意不要以'/'结尾
//过来的每一个客户端的匹配请求链接都是通过WebSocketServer类的实例来维护的
public class WebSocketServer {
//    定义一个全局变量用以存储所有链接信息，该信息对所有Websocket实例可见
//    由于每一个实例在每一个线程里面，所以这个公共变量要求是线程安全的，使用线程安全的hash表：id -> 对应实例
    final public static ConcurrentHashMap<Integer, WebSocketServer> users = new ConcurrentHashMap<>();
    final private static CopyOnWriteArraySet<User> matchpool = new CopyOnWriteArraySet<>();  // 这里匹配池也要开成一个线程安全的匹配池
    private User user;
    private Session session = null;

    private static UserMapper userMapper;  // 标准的Spring中的很多组件都是单例模式，可以直接Autowired注入，这里websocket不是单例模式，这里要定义成一个独一份的变量
    public static RecordMapper recordMapper;
    private Game game = null;


    @Autowired
    public void setUserMapper(UserMapper userMapper) {
        WebSocketServer.userMapper = userMapper;
    }

    @Autowired
    public void setRecordMapper(RecordMapper recordMapper) {  // 如果写在Game里面的话每开一局游戏都会重新定义一个，没必要
        WebSocketServer.recordMapper = recordMapper;
    }

//    这里传token，需要从token当中将user_id解析出来
    @OnOpen
    public void onOpen(Session session, @PathParam("token") String token) throws IOException {
        // 建立连接
        this.session = session;
        System.out.println("connected!");
        Integer userId = JwtAuthentication.getUserId(token);
        this.user = userMapper.selectById(userId);

//        如果user存在则执行后面逻辑
        if(this.user != null) {
            users.put(userId, this);
        } else {
            this.session.close();
        }

        System.out.println(users);
    }

    @OnClose
    public void onClose() {
        // 关闭链接，然后user要从users里面删掉
        System.out.println("disconnected!");
        if(this.user != null) {
            users.remove(this.user.getId());
            matchpool.remove(this.user);
        }
    }

    private void startMatching() {
        System.out.println("start matching");
        matchpool.add(this.user);

        while (matchpool.size() >= 2) {
            Iterator<User> it = matchpool.iterator();
            User a = it.next(), b = it.next();
            matchpool.remove(a);
            matchpool.remove(b);

            Game game = new Game(13, 14, 20, a.getId(), b.getId());  // 两名玩家匹配成功之后就会生成一个新的Game class
            game.createMap();
            users.get(a.getId()).game = game;
            users.get(b.getId()).game = game;

            game.start();  // 然后Game之后就会开启一个新的线程，这就是把不同比赛放进不同的线程当中的过程

            JSONObject respGame = new JSONObject();
            respGame.put("a_id", game.getPlayerA().getId());
            respGame.put("a_sx", game.getPlayerA().getSx());
            respGame.put("a_sy", game.getPlayerA().getSy());
            respGame.put("b_id", game.getPlayerB().getId());
            respGame.put("b_sx", game.getPlayerB().getSx());
            respGame.put("b_sy", game.getPlayerB().getSy());
            respGame.put("map", game.getG());


            JSONObject respA = new JSONObject();
            respA.put("event", "start-matching");
            respA.put("opponent_username", b.getUsername());
            respA.put("opponent_photo", b.getPhoto());
            respA.put("game", respGame);
            users.get(a.getId()).sendMessage(respA.toJSONString());

            JSONObject respB = new JSONObject();
            respB.put("event", "start-matching");
            respB.put("opponent_username", a.getUsername());
            respB.put("opponent_photo", a.getPhoto());
            respB.put("game", respGame);
            users.get(b.getId()).sendMessage(respB.toJSONString());
        }
    }

    private void stopMatching() {
        System.out.println("stop matching");
        matchpool.remove(this.user);
    }

    private void move(int direction) {
        if(game.getPlayerA().getId().equals(user.getId())) {  //user.getId()是获得当前链接的用户id
            game.setNextStepA(direction);
        } else if(game.getPlayerB().getId().equals(user.getId())) {
            game.setNextStepB(direction);
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) {  //OnMessage从前端接收到websocket发过来的东西，一般当作路由
        // 从Client接收消息
        System.out.println("receive message!");

//        解析前端发过来的JSON.stringify字符串中的event取出来
        JSONObject data = JSONObject.parseObject(message);
        String event = data.getString("event");
        if("start-matching".equals(event)) {
            startMatching();
        } else if("stop-matching".equals(event)) {
            stopMatching();
        } else if("move".equals(event)) {
            move(data.getInteger("direction"));
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }

//    将信息发送给前端
    public void sendMessage(String message) {
//        这是个异步通信过程，首先要加个锁
        synchronized (this.session) {
            try {
                this.session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}

