package com.tungpv.fx5_server.security;

import com.tungpv.fx5_server.entity.Users;
import com.tungpv.fx5_server.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepository.findByUserName(username);
        if(user != null){
            return CustomUserDetails.mapUserToUserDetail(user);
        } else {
            throw new UsernameNotFoundException(username);
        }
    }
}
