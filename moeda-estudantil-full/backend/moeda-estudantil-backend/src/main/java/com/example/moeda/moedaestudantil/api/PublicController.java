package com.example.moeda.moedaestudantil.api;
import org.springframework.http.ResponseEntity; 
import org.springframework.web.bind.annotation.*; 
import com.example.moeda.moedaestudantil.service.BenefitService;
@RestController 
@RequestMapping("/api") 
@CrossOrigin
public class PublicController {
  private final BenefitService benefits; public PublicController(BenefitService benefits) 
  { this.benefits = benefits; }
  @GetMapping("/beneficios") public ResponseEntity<?> listActive() 
  { return ResponseEntity.ok(benefits.listAllActive()); }
}
