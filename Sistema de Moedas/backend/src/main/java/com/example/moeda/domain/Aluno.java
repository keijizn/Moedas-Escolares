package com.example.moeda.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aluno {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  private String nome;

  @Email
  @NotBlank
  @Column(unique = true)
  private String email;

  @NotBlank
  @Column(unique = true)
  private String cpf;

  private String curso;
}
