package pl.sztyro.carapp.rest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import pl.sztyro.core.model.MenuNode;
import pl.sztyro.core.model.User;
import pl.sztyro.core.rest.MenuController;
import pl.sztyro.security.CurrentUserProvider;

import javax.persistence.EntityManager;
import java.util.LinkedList;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = {MenuController.class})
@EnableAutoConfiguration
@EntityScan("pl.sztyro")
class MenuControllerTest {


    @MockBean
    private EntityManager em;

    @MockBean
    private CurrentUserProvider userService;

    @Autowired
    private MenuController menuController;

    @BeforeEach
    public void init(){
        Mockito.when(userService.getCurrent()).thenReturn(
                User.builder()
                        .authorities(Set.of("ROLE_Admin"))
                        .build()
        );
    }

    @Test
    public void shouldReturnMenuTree(){
        LinkedList<MenuNode> menu = menuController.getMenu();

        MenuNode dictionaryNode = menu.stream()
                .filter(e -> "Dictionaries".equals(e.getName()))
                .findFirst()
                .orElseThrow();
        LinkedList<MenuNode> dictionaryNodeChildren = dictionaryNode.getChildren();

        assertFalse(dictionaryNodeChildren.isEmpty());
        Set<MenuNode> tiresNode = dictionaryNodeChildren.stream()
                .filter(e -> "Tires".equals(e.getName()))
                .collect(Collectors.toSet());

        assertEquals(1, tiresNode.size());
    }
}