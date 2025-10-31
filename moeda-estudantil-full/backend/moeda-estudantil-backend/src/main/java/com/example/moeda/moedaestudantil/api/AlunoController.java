package com.example.moeda.moedaestudantil.api;

import com.example.moeda.moedaestudantil.domain.LedgerKind;
import com.example.moeda.moedaestudantil.domain.UserType;
import com.example.moeda.moedaestudantil.repo.LedgerRepository;
import com.example.moeda.moedaestudantil.service.AlunoService;
import com.example.moeda.moedaestudantil.service.BenefitService;
import com.example.moeda.moedaestudantil.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/alunos")
@CrossOrigin
public class AlunoController {

    private final AlunoService alunoService;
    private final WalletService walletService;
    private final LedgerRepository ledgerRepo;
    private final BenefitService benefitService;

    public AlunoController(
            AlunoService alunoService,
            WalletService walletService,
            LedgerRepository ledgerRepo,
            BenefitService benefitService
    ) {
        this.alunoService = alunoService;
        this.walletService = walletService;
        this.ledgerRepo = ledgerRepo;
        this.benefitService = benefitService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable("id") Long id) {
        return ResponseEntity.ok(alunoService.get(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable("id") Long id,
                                    @RequestBody Map<String, String> body) {
        var a = alunoService.update(id, body.get("nome"), body.get("curso"), body.get("email"));
        return ResponseEntity.ok(a);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        alunoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/wallet")
    public ResponseEntity<?> saldo(@PathVariable("id") Long id) {
        var w = walletService.getOrCreate(UserType.ALUNO, id);
        return ResponseEntity.ok(Map.of("saldo", w.getSaldo()));
    }

    @GetMapping("/{id}/ledger")
    public ResponseEntity<?> ledger(@PathVariable("id") Long id) {
        return ResponseEntity.ok(
                ledgerRepo.findByFromTypeAndFromIdOrToTypeAndToIdOrderByTsDesc(
                        UserType.ALUNO, id, UserType.ALUNO, id
                )
        );
    }

    @PostMapping("/{id}/redeem/{benefitId}")
    public ResponseEntity<?> redeem(@PathVariable("id") Long id,
                                    @PathVariable("benefitId") Long benefitId) {
        var b = benefitService.listAllActive().stream()
                .filter(x -> x.getId().equals(benefitId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Benefício não encontrado"));

        walletService.transfer(
                UserType.ALUNO, id,
                UserType.EMPRESA, b.getEmpresaId(),
                b.getCusto(),
                "Resgate: " + b.getTitulo(),
                LedgerKind.REDEEM
        );

        return ResponseEntity.ok().build();
    }
}
