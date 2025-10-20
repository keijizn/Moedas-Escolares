package com.example.moeda.api;

import com.example.moeda.domain.EmpresaParceira;
import com.example.moeda.repo.EmpresaParceiraRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:5500","http://127.0.0.1:5500","http://localhost:5173","http://localhost:8080","*"})
@RestController
@RequestMapping("/api/empresas")
public class EmpresaParceiraController {

  private final EmpresaParceiraRepository repo;
  public EmpresaParceiraController(EmpresaParceiraRepository repo) { this.repo = repo; }

  @GetMapping
  public List<EmpresaParceira> listar() { return repo.findAll(); }

  @GetMapping("/{id}")
  public ResponseEntity<EmpresaParceira> detalhar(@PathVariable Long id) {
    return repo.findById(id).map(ResponseEntity::ok)
              .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<EmpresaParceira> criar(@RequestBody EmpresaParceira e) {
    EmpresaParceira salvo = repo.save(e);
    return ResponseEntity.ok(salvo);
  }

  @PutMapping("/{id}")
  public ResponseEntity<EmpresaParceira> atualizar(@PathVariable Long id, @RequestBody EmpresaParceira e) {
    return repo.findById(id).map(ex -> {
      ex.setNomeFantasia(e.getNomeFantasia());
      ex.setEmail(e.getEmail());
      ex.setCnpj(e.getCnpj());
      ex.setTelefone(e.getTelefone());
      ex.setDescricao(e.getDescricao());
      return ResponseEntity.ok(repo.save(ex));
    }).orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> excluir(@PathVariable Long id) {
    if (!repo.existsById(id)) return ResponseEntity.notFound().build();
    repo.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}
