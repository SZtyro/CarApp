package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.carapp.enums.TireType;
import pl.sztyro.core.annotation.FrontendSearch;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.interfaces.MenuItem;
import pl.sztyro.core.model.BaseDictionary;
import pl.sztyro.core.model.MenuNode;

import javax.persistence.*;
import java.util.Collections;
import java.util.LinkedList;

@Setter
@Getter
@Entity
@Secure()
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class TireModel extends BaseDictionary implements MenuItem {

    @FrontendSearch(path = "company.name")
    @ManyToOne(fetch = FetchType.LAZY)
    private TireCompany company;

    @FrontendSearch
    @Enumerated(EnumType.STRING)
    private TireType type;

    public static MenuNode getNode() {
        return getDictionaryNode().pushChildren(
                MenuNode.builder()
                        .name("Tires")
                        .icon("emoji_transportation")
                        .children(new LinkedList<MenuNode>(
                                Collections.singletonList(
                                        MenuNode.builder()
                                                .path("TireModels")
                                                .icon("stars")
                                                .build()
                                )
                        ))
                        .build()

        );
    }
}
