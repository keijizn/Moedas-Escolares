package com.example.moeda.moedaestudantil.api;
import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*; import jakarta.validation.Valid;
import com.example.moeda.moedaestudantil.dto.AuthDtos.*; import com.example.moeda.moedaestudantil.service.AuthService;
@RestController @RequestMapping("/api/auth") @CrossOrigin
public class AuthController {
  private final AuthService service; public AuthController(AuthService service) { this.service = service; }
  @PostMapping("/aluno/register") public ResponseEntity<?> cadAluno(@Valid @RequestBody AlunoRegister dto) { return ResponseEntity.ok(service.registerAluno(dto)); }
  @PostMapping("/professor/register") public ResponseEntity<?> cadProfessor(@Valid @RequestBody ProfessorRegister dto) { return ResponseEntity.ok(service.registerProfessor(dto)); }
  @PostMapping("/empresa/register") public ResponseEntity<?> cadEmpresa(@Valid @RequestBody EmpresaRegister dto) { return ResponseEntity.ok(service.registerEmpresa(dto)); }
  @PostMapping("/login") public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest dto) { return ResponseEntity.ok(service.login(dto)); }
}
