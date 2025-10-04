package com.fosso.backend.fosso_backend.config;

import com.fosso.backend.fosso_backend.security.filters.JwtAuthenticationFilter;
import com.fosso.backend.fosso_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserRepository userRepository;
    private static final Long MAX_AGE = 3600L;
    private static final int CORS_FILTER_ORDER = -102;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return userEmail ->
                userRepository.findByEmail(userEmail)
                        .orElseThrow(() ->
                                new UsernameNotFoundException("User not found with email: " + userEmail)
                        );
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilet, AuthenticationProvider authenticationProvider) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors
                        .configurationSource(request -> {
                        CorsConfiguration corsConfig = new CorsConfiguration();
                        corsConfig.setAllowedOriginPatterns(List.of("*"));
                        corsConfig.setAllowCredentials(true);
                        corsConfig.setAllowedHeaders(Arrays.asList(
                                HttpHeaders.AUTHORIZATION,
                                HttpHeaders.ACCEPT,
                                HttpHeaders.CONTENT_TYPE,
                                HttpHeaders.ORIGIN ));
                        corsConfig.setAllowedMethods(Arrays.asList(
                                HttpMethod.GET.name(),
                                HttpMethod.POST.name(),
                                HttpMethod.PUT.name(),
                                HttpMethod.DELETE.name()
                        ));
                        corsConfig.setMaxAge(MAX_AGE);
                        return corsConfig;
                    })
                )
                .authorizeHttpRequests(requset ->
                        requset.requestMatchers("/auth/**",
                                        "/categories",
                                        "/categories/**",
                                        "/user/**",
                                        "/images",
                                        "/images/user",
                                        "/images/user/**",
                                        "/brands",
                                        "/brands/**",
                                        "/products",
                                        "/products/**",
                                        "/reviews",
                                        "/reviews/**").permitAll()
                                .requestMatchers("/user/me",
                                        "/user/me**",
                                        "/cart",
                                        "/cart/**",
                                        "/orders",
                                        "/orders/**").hasRole("USER")
                                .requestMatchers("/merchant",
                                        "/merchant/**",
                                        "/images/merchant",
                                        "/images/merchant/**").hasRole("MERCHANT")
                                .requestMatchers("/admin", "/admin/**").hasRole("ADMIN")
                                .anyRequest().authenticated()
                ).sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                ).userDetailsService(userDetailsService())
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtFilet, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}