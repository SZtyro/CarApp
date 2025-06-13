package pl.sztyro.carapp.rest;


import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
public class DashboardControllerTest extends BaseEventIntegrationTest  {

    @BeforeAll
    public void init(){
        super.init();
    }

    @Test
    void shouldRespectSummaryPermissions() throws Exception {
        String url = "/api/dashboard/summary/";
        mvcOAuth2(get(url + toyota.getId())).andExpect(status().isOk());
        mvcOAuth2(get(url + mercedes.getId())).andExpect(status().isForbidden());
        mvc.perform(get(url + mercedes.getId())).andExpect(status().isUnauthorized());
    }
}
