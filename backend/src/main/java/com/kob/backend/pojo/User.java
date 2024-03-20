package com.kob.backend.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Integer id;  //最好不要用int，要用Integer对象，因为用int后再用mybatis-plus会有warning
    private String username;
    private String password;
}
