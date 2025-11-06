package com.tungpv.fx5_server.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tungpv.fx5_server.entity.Role;
import com.tungpv.fx5_server.entity.Users;
import lombok.*;
import org.hibernate.internal.util.collections.ArrayHelper;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CustomUserDetails implements UserDetails {

    private int userId;
    private String username;
    @JsonIgnore
    private String password;
    private String fullname;
    private String email;
    private Collection<? extends GrantedAuthority> authorities;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    public static CustomUserDetails mapUserToUserDetail(Users user) {
        //Get list roles from Account
        List<GrantedAuthority> listAuthorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName().name())) //scan each role in list roles and cast it into SimpleGrantedAuthority
                .collect(Collectors.toList()); //assign to listAuthorities

        return new CustomUserDetails(user.getUserId(),
                user.getUsername(),
                user.getPassword(),
                user.getFullname(),
                user.getEmail(),
                listAuthorities);
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
