package com.kob.backend.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bot {
    @TableId(type = IdType.AUTO)
    private Integer id;  //最好不要用int，要用Integer对象，因为用int后再用mybatis-plus会有warning
    private Integer userId;  //这里命名时注意，数据用的_命名的话，这里需要用驼峰命名法，比如这里数据库是user_id，那么这里要起成userId
    private String title;
    private String description;
    private String content;
    private Integer rating;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createtime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date modifytime;
}
