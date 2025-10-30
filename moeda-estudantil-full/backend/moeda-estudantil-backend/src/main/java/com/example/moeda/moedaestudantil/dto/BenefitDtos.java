package com.example.moeda.moedaestudantil.dto;
import jakarta.validation.constraints.*;
public class BenefitDtos {
  public static class Create { @NotBlank public String titulo; public String descricao; @Min(1) public Integer custo; }
}
