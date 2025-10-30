package com.example.moeda.moedaestudantil.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.moeda.moedaestudantil.domain.Benefit;
import java.util.List;
public interface BenefitRepository extends JpaRepository<Benefit, Long> {
  List<Benefit> findByEmpresaId(Long empresaId);
  List<Benefit> findByAtivoTrue();
}
