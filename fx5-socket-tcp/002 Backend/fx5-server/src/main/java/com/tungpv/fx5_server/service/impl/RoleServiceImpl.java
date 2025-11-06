package com.tungpv.fx5_server.service.impl;

import com.tungpv.fx5_server.entity.ERole;
import com.tungpv.fx5_server.entity.Role;
import com.tungpv.fx5_server.repository.RoleRepository;
import com.tungpv.fx5_server.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Optional<Role> findByRoleName(ERole roleName) {
        return roleRepository.findByRoleName(roleName);
    }
}
