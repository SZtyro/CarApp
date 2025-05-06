package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.interfaces.MenuItem;
import pl.sztyro.core.model.BaseDictionary;
import pl.sztyro.core.model.MenuNode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import java.util.*;

@Entity
@Secure()
@SuperBuilder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
public class TireCompany extends BaseDictionary implements MenuItem {

    @Column
    private String logoUrl;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    private Set<TireModel> models;

    public static MenuNode getNode() {
        return getDictionaryNode().pushChildren(
                MenuNode.builder()
                        .name("Tires")
                        .icon("emoji_transportation")
                        .children(new LinkedList<MenuNode>(
                                Collections.singletonList(
                                        MenuNode.builder()
                                                .path("TireCompanies")
                                                .icon("emoji_transportation")
                                                .build()
                                )
                        ))
                        .build()

        );
    }

}
