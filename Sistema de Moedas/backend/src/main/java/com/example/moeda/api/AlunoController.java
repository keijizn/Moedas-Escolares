package com.example.moeda.api;

import com.example.moeda.domain.Aluno;
import com.example.moeda.repo.AlunoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:5500","http://127.0.0.1:5500","http://localhost:5173","http://localhost:8080","*"})
@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

  private final AlunoRepository repo;
  public AlunoController(AlunoRepository repo) { this.repo = repo; }

  @GetMapping
  public List<Aluno> listar() { return repo.findAll(); }

  @GetMapping("/{id}")
  public ResponseEntity<Aluno> detalhar(@PathVariable Long id) {
    return repo.findById(id).map(ResponseEntity::ok)
              .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Aluno> criar(@RequestBody Aluno a) {
    Aluno salvo = repo.save(a);
    return ResponseEntity.ok(salvo);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Aluno> atualizar(@PathVariable Long id, @RequestBody Aluno a) {
    return repo.findById(id).map(ex -> {
      ex.setNome(a.getNome());
      ex.setEmail(a.getEmail());
      ex.setCpf(a.getCpf());
      ex.setCurso(a.getCurso());
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
