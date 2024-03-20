package com.kob.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.kob.backend.pojo.User;
import org.apache.ibatis.annotations.Mapper;

/* 使用mybatis-plus就不需要使用sql语句 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
}
