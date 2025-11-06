package com.tungpv.fx5_server.service;

import com.tungpv.fx5_server.entity.ERole;
import com.tungpv.fx5_server.entity.Role;

import java.util.Optional;

public interface RoleService {
    Optional<Role> findByRoleName(ERole roleName);
}
