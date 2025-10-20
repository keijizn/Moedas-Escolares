package com.example.moeda.repo;

import com.example.moeda.domain.EmpresaParceira;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmpresaParceiraRepository extends JpaRepository<EmpresaParceira, Long> {    Optional<EmpresaParceira> findByEmail(String email);
}
