package com.example.moeda.moedaestudantil.api;
import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*; import jakarta.validation.Valid; import java.util.Map;
import com.example.moeda.moedaestudantil.dto.TransferDtos.*; import com.example.moeda.moedaestudantil.domain.*; import com.example.moeda.moedaestudantil.service.*; import com.example.moeda.moedaestudantil.repo.*;
@RestController @RequestMapping("/api/professores") @CrossOrigin
public class ProfessorController {
  private final ProfessorService svc; private final WalletService wallet; private final LedgerRepository ledgerRepo;
  public ProfessorController(ProfessorService svc, WalletService wallet, LedgerRepository ledgerRepo) { this.svc = svc; this.wallet = wallet; this.ledgerRepo = ledgerRepo; }
  @GetMapping("/<built-in function id>") public ResponseEntity<?> get(@PathVariable Long id) { return ResponseEntity.ok(svc.get(id)); }
  @GetMapping("/<built-in function id>/wallet") public ResponseEntity<?> saldo(@PathVariable Long id) { var w = wallet.getOrCreate(UserType.PROFESSOR, id); return ResponseEntity.ok(Map.of("saldo", w.getSaldo())); }
  @GetMapping("/<built-in function id>/ledger") public ResponseEntity<?> ledger(@PathVariable Long id) { return ResponseEntity.ok(ledgerRepo.findByFromTypeAndFromIdOrToTypeAndToIdOrderByTsDesc(UserType.PROFESSOR, id, UserType.PROFESSOR, id)); }
  @PostMapping("/<built-in function id>/grant") public ResponseEntity<?> grant(@PathVariable Long id, @Valid @RequestBody GrantAluno dto) {
    wallet.transfer(UserType.PROFESSOR, id, UserType.ALUNO, dto.alunoId, dto.amount, dto.reason, LedgerKind.GRANT); return ResponseEntity.ok().build();
  }
}
