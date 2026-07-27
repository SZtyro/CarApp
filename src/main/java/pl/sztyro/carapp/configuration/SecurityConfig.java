package pl.sztyro.carapp.configuration;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import pl.sztyro.core.service.UserService;
import pl.sztyro.security.auth.RememberMeConfig;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final AuthenticationSuccessHandler successHandler;
    private final RememberMeConfig rememberMeConfig;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, UserService userService) throws Exception {
        http
                .authorizeRequests()
                .antMatchers(
                        "/",
                        "/index.html",
                        "/favicon.ico",
                        "/**/*.css",
                        "/**/*.js",
                        "/ngsw.json",
                        "/ngsw-worker.js",
                        "/manifest.webmanifest",
                        "/assets/**",
                        "/icons/**",
                        "/**/*.png",
                        "/**/*.jpg",
                        "/**/*.jpeg",
                        "/**/*.svg",
                        "/**/*.woff2",
                        "/**/*.ttf",
                        "/api/public/**",
                        "/api/temporaryLogin/**",
                        "/api/auth/**",
                        "/oauth2/**",
                        "/login/oauth2/**",
                        "/error",
                        "/.well-known/**"
                ).permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .csrf()
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .and()
                .oauth2Login(httpSecurityOAuth2LoginConfigurer -> {
                    httpSecurityOAuth2LoginConfigurer.successHandler(successHandler);
                })
                .oauth2Client().and()
                .logout()
                .logoutUrl("/api/profile/logout")
                //                .logoutSuccessHandler(logoutSuccessHandler())
                .deleteCookies("JSESSIONID", RememberMeConfig.COOKIE_NAME)
                .clearAuthentication(true)
                .invalidateHttpSession(true)

                .and()
                .rememberMe()
                .key(rememberMeConfig.getRememberMeKey())
                .tokenValiditySeconds(60 * 60 * 24 * 14) // 14 days
                .rememberMeCookieName(RememberMeConfig.COOKIE_NAME)
                .userDetailsService(userService)
                .rememberMeServices(rememberMeConfig.getRememberMeServices())
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));

        return http.getOrBuild();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder)
                .and()
                .build();
    }
}
