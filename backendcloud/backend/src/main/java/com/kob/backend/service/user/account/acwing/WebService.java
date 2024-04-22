package com.kob.backend.service.user.account.acwing;

import com.alibaba.fastjson2.JSONObject;

public interface WebService {
    JSONObject applyCode();
    JSONObject receiveCode(String code, String state);  // 接受服务器发送结果的接口
}
