package com.example.moeda.moedaestudantil.domain;
import jakarta.persistence.*; import jakarta.validation.constraints.*; import lombok.*;
@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Benefit {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @NotNull private Long empresaId;
  @NotBlank private String titulo;
  private String descricao;
  @Min(1) private Integer custo;
  private boolean ativo = true;
}
