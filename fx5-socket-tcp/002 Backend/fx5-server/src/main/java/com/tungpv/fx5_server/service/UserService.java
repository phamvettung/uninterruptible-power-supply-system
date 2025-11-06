package com.tungpv.fx5_server.service;


import com.tungpv.fx5_server.entity.Users;

import java.util.List;

public interface UserService {
    Users findByUsername(String userName);
    boolean exitsByUsername(String userName);
    boolean exitsByEmail(String email);
    Users saveOrUpdate(Users user);
    List<Users> getAll();
}
