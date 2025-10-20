package com.example.moeda.api;

import com.example.moeda.domain.Aluno;
import com.example.moeda.domain.EmpresaParceira;
import com.example.moeda.repo.AlunoRepository;
import com.example.moeda.repo.EmpresaParceiraRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AlunoRepository alunoRepo;
    private final EmpresaParceiraRepository empRepo;

    public AuthController(AlunoRepository alunoRepo, EmpresaParceiraRepository empRepo) {
        this.alunoRepo = alunoRepo;
        this.empRepo = empRepo;
    }

    // ===== CADASTRO ALUNO =====
    @PostMapping("/aluno/register")
    public ResponseEntity<?> cadAluno(@RequestBody Map<String, String> body) {
        String nome  = body.getOrDefault("nome", "");
        String email = body.getOrDefault("email", "");
        String cpf   = body.getOrDefault("cpf", "");
        String curso = body.getOrDefault("curso", "");
        // String senha = body.getOrDefault("senha", ""); // por enquanto ignoramos

        // validação simples
        if (email.isBlank() || nome.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Nome e email são obrigatórios"));
        }
        if (alunoRepo.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email de aluno já cadastrado"));
        }

        Aluno salvo = alunoRepo.save(new Aluno(null, nome, email, cpf, curso));
        return ResponseEntity.ok(Map.of("message", "Aluno cadastrado", "id", salvo.getId()));
    }

    // ===== CADASTRO EMPRESA =====
    @PostMapping("/empresa/register")
    public ResponseEntity<?> cadEmpresa(@RequestBody Map<String, String> body) {
        String nomeFantasia = body.getOrDefault("nomeFantasia", "");
        String email        = body.getOrDefault("email", "");
        String cnpj         = body.getOrDefault("cnpj", "");
        String telefone     = body.getOrDefault("telefone", "");
        // String senha     = body.getOrDefault("senha", "");

        if (email.isBlank() || nomeFantasia.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Nome fantasia e email são obrigatórios"));
        }
        if (empRepo.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email de empresa já cadastrado"));
        }

        EmpresaParceira salvo = empRepo.save(new EmpresaParceira(null, nomeFantasia, email, cnpj, telefone, null));
        return ResponseEntity.ok(Map.of("message", "Empresa cadastrada", "id", salvo.getId()));
    }

    // ===== LOGIN (apenas stub por enquanto) =====
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "");
        String tipo  = body.getOrDefault("tipo", "ALUNO"); // "ALUNO" | "EMPRESA"

        Long id = null;
        if ("EMPRESA".equalsIgnoreCase(tipo)) {
            id = empRepo.findByEmail(email).map(EmpresaParceira::getId).orElse(0L);
        } else {
            id = alunoRepo.findByEmail(email).map(Aluno::getId).orElse(0L);
        }

        // NÃO valida senha ainda — apenas retorna um "token" fake p/ o front seguir
        return ResponseEntity.ok(Map.of(
                "token", "fake-token-123",
                "userId", id,
                "role", tipo,
                "nome", email.split("@")[0]
        ));
    }
}
