package com.example.moeda;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@SpringBootApplication
public class MoedaApplication {
  public static void main(String[] args) {
    SpringApplication.run(MoedaApplication.class, args);
  }

  @Bean
  CorsFilter corsFilter(org.springframework.core.env.Environment env) {
    String origins = env.getProperty("app.corsAllowedOrigins", "*");
    CorsConfiguration cfg = new CorsConfiguration();
    cfg.setAllowedOrigins(Arrays.asList(origins.split(",")));
    cfg.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
    cfg.setAllowedHeaders(Arrays.asList("*"));
    cfg.setAllowCredentials(false);
    UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/**", cfg);
    return new CorsFilter(src);
  }
}
