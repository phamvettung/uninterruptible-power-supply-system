package com.tungpv.fx5_server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@SuppressWarnings("serial")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Role")
public class Role implements Serializable {
    @Id
    @Column(name = "RoleId", length = 10)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int roleId;

    @Column(name = "RoleName", columnDefinition = "NVARCHAR(50)")
    @Enumerated(EnumType.STRING)
    private ERole roleName;
}
