package com.example.moeda.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaParceira {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  private String nomeFantasia;

  @Email
  @NotBlank
  @Column(unique = true)
  private String email;

  @Column(unique = true)
  private String cnpj;

  private String telefone;

  @Column(length = 1000)
  private String descricao;
}
