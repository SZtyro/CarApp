package pl.sztyro.carapp.rest;


import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInstance;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import pl.sztyro.core.model.User;
import pl.sztyro.core.repository.UserRepository;
import pl.sztyro.core.service.DateService;
import pl.sztyro.core.service.UserService;

import static org.mockito.Mockito.when;

@SpringBootTest()
@ActiveProfiles({"test"})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@AutoConfigureMockMvc
public abstract class BaseIntegrationTest {

    @Autowired
    protected UserRepository users;

    @Autowired
    protected UserService userService;

    @Autowired
    protected MockMvc mvc;

    @Autowired
    protected DateService dateService;

    @MockBean
    private JavaMailSender javaMailSender;

    @MockBean
    private ClientRegistrationRepository repository;

    protected String testerMail = "user@example.com";

    @BeforeAll
    public void init(){
        User user = new User();
        user.setEmail(testerMail);
        users.save(user);

        System.out.println("Tester " + testerMail);
    }

    @BeforeEach
    public void setUp() {
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Authentication authentication = Mockito.mock(Authentication.class);
        OAuth2User oAuth2User = Mockito.mock(OAuth2User.class);

        when(oAuth2User.getAttribute("email")).thenReturn(testerMail);
        when(authentication.getPrincipal()).thenReturn(oAuth2User);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);


    }

    protected User getTester(){
        return users.findById(testerMail).get();
    }

    protected ResultActions mvcOAuth2(MockHttpServletRequestBuilder request) throws Exception {
        return mvc.perform(request
                .with(SecurityMockMvcRequestPostProcessors.oauth2Login().attributes(stringObjectMap -> {
                    stringObjectMap.put("email", testerMail);
                }))
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
        );
    }
}
