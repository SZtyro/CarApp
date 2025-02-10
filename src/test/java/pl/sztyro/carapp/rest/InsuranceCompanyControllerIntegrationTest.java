package pl.sztyro.carapp.rest;

import org.json.JSONObject;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import pl.sztyro.carapp.model.InsuranceCompany;
import pl.sztyro.carapp.repository.InsuranceCompanyRepository;
import pl.sztyro.core.model.User;
import pl.sztyro.core.repository.UserRepository;

import java.util.Map;
import java.util.function.Consumer;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
@WebAppConfiguration
@ActiveProfiles({"test"})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class InsuranceCompanyControllerIntegrationTest {

    @Autowired
    InsuranceCompanyController controller;

    @Autowired
    InsuranceCompanyRepository repository;

    @Autowired
    UserRepository users;

    @Autowired
    MockMvc mockMvc;

    final String testUserEmail = "tester@test.com";
    final String anotherUserEmail = "another@test.com";

    Consumer<Map<String, Object>> userAttributes = stringObjectMap -> {
        stringObjectMap.put("email", testUserEmail);
    };

    @BeforeAll
    void init(){

        User tester = new User();
        tester.setEmail(testUserEmail);
        users.save(tester);

        User anotherUser = new User();
        anotherUser.setEmail(anotherUserEmail);
        users.save(anotherUser);

        repository.save(InsuranceCompany
                .builder()
                .author(anotherUser)
                .name("PZU")
                .build()
        );
        repository.save(InsuranceCompany
                .builder()
                .author(anotherUser)
                .name("Warta")
                .build()
        );

    }

    @Test
    public void anyUserShouldFetchCompanies() throws Exception {
        mvcOAuth2(get("/api/insuranceCompanies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results.length()").value(2));
    }

    @Test
    public void dontLetUsersCreateCompany() throws Exception {
        mvcOAuth2(post("/api/insuranceCompanies"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void dontLetUsersEditCompany() throws Exception {
        InsuranceCompany insuranceCompany = repository.findAll().get(0);
//        insuranceCompany.setAuthor(users.findById(anotherUserEmail).get());

        JSONObject object = new JSONObject(insuranceCompany);
        object.put("createdDate", "null");
        mvcOAuth2(put("/api/insuranceCompanies/" + insuranceCompany.getId())
                .content(object.toString()))
                .andExpect(status().isForbidden());
    }

    protected ResultActions mvcOAuth2(MockHttpServletRequestBuilder request) throws Exception {
        return mockMvc.perform(request
                .with(SecurityMockMvcRequestPostProcessors.oauth2Login().attributes(userAttributes))
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
        );
    }
}
