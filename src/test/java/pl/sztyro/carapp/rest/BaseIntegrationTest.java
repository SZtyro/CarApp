package pl.sztyro.carapp.rest;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInstance;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.test.context.ActiveProfiles;
import pl.sztyro.core.model.User;
import pl.sztyro.core.repository.UserRepository;
import pl.sztyro.core.service.UserService;

import static org.mockito.Mockito.when;

@SpringBootTest()
@ActiveProfiles({"test"})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public abstract class BaseIntegrationTest {

    @Autowired
    protected UserRepository users;

    @Autowired
    protected UserService userService;

    protected String testerMail = "user@example.com";

    public void init(){
        User user = new User();
        user.setEmail(testerMail);
        users.save(user);
    }

    @BeforeEach
    public void setUp() {
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Authentication authentication = Mockito.mock(Authentication.class);
        OidcUser oAuth2User = Mockito.mock(OidcUser.class);

        when(oAuth2User.getEmail()).thenReturn(testerMail);
        when(authentication.getPrincipal()).thenReturn(oAuth2User);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    protected User getTester(){
        return users.findById(testerMail).get();
    }


}
