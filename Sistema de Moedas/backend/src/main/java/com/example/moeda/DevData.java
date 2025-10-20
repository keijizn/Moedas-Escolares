package com.example.moeda;

import com.example.moeda.domain.*;
import com.example.moeda.repo.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DevData {
  @Bean
  CommandLineRunner seed(AlunoRepository alunoRepo, EmpresaParceiraRepository empRepo) {
    return args -> {
      if (alunoRepo.count() == 0) {
        alunoRepo.save(new Aluno(null, "Ana Silva", "ana@ex.com", "111.111.111-11", "Engenharia"));
        alunoRepo.save(new Aluno(null, "Bruno Lima", "bruno@ex.com", "222.222.222-22", "ADS"));
      }
      if (empRepo.count() == 0) {
        empRepo.save(new EmpresaParceira(null, "Tech LTDA", "contato@tech.com",
                "00.000.000/0001-00", "(31) 90000-0000", "Empresa parceira de TI"));
      }
    };
  }
}
