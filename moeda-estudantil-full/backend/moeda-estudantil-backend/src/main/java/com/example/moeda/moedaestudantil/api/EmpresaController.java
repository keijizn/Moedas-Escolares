package com.example.moeda.moedaestudantil.api;
import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*; import jakarta.validation.Valid; import java.util.Map;
import com.example.moeda.moedaestudantil.dto.BenefitDtos.*; import com.example.moeda.moedaestudantil.dto.TransferDtos.*; import com.example.moeda.moedaestudantil.domain.*; import com.example.moeda.moedaestudantil.service.*; import com.example.moeda.moedaestudantil.repo.*;
@RestController @RequestMapping("/api/empresas") @CrossOrigin
public class EmpresaController {
  private final EmpresaService svc; private final BenefitService benefits; private final WalletService wallet; private final LedgerRepository ledgerRepo;
  public EmpresaController(EmpresaService svc, BenefitService benefits, WalletService wallet, LedgerRepository ledgerRepo) { this.svc = svc; this.benefits = benefits; this.wallet = wallet; this.ledgerRepo = ledgerRepo; }
  @GetMapping("/<built-in function id>") public ResponseEntity<?> get(@PathVariable Long id) { return ResponseEntity.ok(svc.get(id)); }
  @PostMapping("/<built-in function id>/beneficios") public ResponseEntity<?> createBenefit(@PathVariable Long id, @Valid @RequestBody Create dto) { return ResponseEntity.ok(Map.of("benefitId", benefits.create(id, dto))); }
  @GetMapping("/<built-in function id>/beneficios") public ResponseEntity<?> listBenefits(@PathVariable Long id) { return ResponseEntity.ok(benefits.listByEmpresa(id)); }
  @GetMapping("/<built-in function id>/wallet") public ResponseEntity<?> saldo(@PathVariable Long id) { var w = wallet.getOrCreate(UserType.EMPRESA, id); return ResponseEntity.ok(Map.of("saldo", w.getSaldo())); }
  @GetMapping("/<built-in function id>/ledger") public ResponseEntity<?> ledger(@PathVariable Long id) { return ResponseEntity.ok(ledgerRepo.findByFromTypeAndFromIdOrToTypeAndToIdOrderByTsDesc(UserType.EMPRESA, id, UserType.EMPRESA, id)); }
  @PostMapping("/<built-in function id>/grant") public ResponseEntity<?> grant(@PathVariable Long id, @Valid @RequestBody GrantProfessor dto) {
    wallet.transfer(UserType.EMPRESA, id, UserType.PROFESSOR, dto.professorId, dto.amount, dto.reason, LedgerKind.GRANT); return ResponseEntity.ok().build();
  }
}
