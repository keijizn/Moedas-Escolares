package com.example.moeda.moedaestudantil.service;
import com.example.moeda.moedaestudantil.domain.*; import com.example.moeda.moedaestudantil.dto.BenefitDtos.*; import com.example.moeda.moedaestudantil.repo.*; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service
public class BenefitService {
  private final BenefitRepository repo;
  public BenefitService(BenefitRepository repo) { this.repo = repo; }
  @Transactional
  public Long create(Long empresaId, Create dto) {
    var b = repo.save(Benefit.builder().empresaId(empresaId).titulo(dto.titulo).descricao(dto.descricao).custo(dto.custo).ativo(true).build());
    return b.getId();
  }
  public List<Benefit> listAllActive() { return repo.findByAtivoTrue(); }
  public List<Benefit> listByEmpresa(Long empresaId) { return repo.findByEmpresaId(empresaId); }
}
