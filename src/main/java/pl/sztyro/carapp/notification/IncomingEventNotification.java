package pl.sztyro.carapp.notification;


import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.reflections.Reflections;
import pl.sztyro.carapp.model.*;
import pl.sztyro.core.interfaces.SendingService;
import pl.sztyro.core.model.User;
import pl.sztyro.mail.MailProperties;
import pl.sztyro.mail.notification.EntityNotification;

import javax.persistence.EntityManager;
import javax.persistence.criteria.*;
import java.lang.reflect.Modifier;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
public class IncomingEventNotification extends EntityNotification<IncomingEventNotification.Params> {

    public IncomingEventNotification(EntityManager entityManager, SendingService sendingService){
        super(entityManager, sendingService);
    }

    @Override
    public String getSubject() {
        return "NOTIFICATIONS.INCOMING_EVENT.subject";
    }


    @Override
    public List<Params> getNotificationEntities() {
        LocalDate today = LocalDate.now();
        List<Params> allResults = new ArrayList<>();

        for (Class<? extends NotifiableCarEvent> eventClass : notifiableEventClasses()) {
            CriteriaQuery<Params> cq = criteriaBuilder.createQuery(Params.class);
            Root<? extends NotifiableCarEvent> from = cq.from(eventClass);


            cq.select(criteriaBuilder.construct(
                    Params.class,
                    from.get(CarEvent_.id),
                    from.get(CarEvent_.author),
                    from.get(CarEvent_.date),
                    from.type()
            ));

            cq.where(criteriaBuilder.equal(from.get("fireDate"), today));

            List<Params> resultList = em.createQuery(cq).getResultList();
            log.debug("Found entities of notification [notifiableClass={}, count={}]", eventClass, resultList.size());
            allResults.addAll(resultList);
        }

        return allResults
                .stream()
                .map((Params entity) -> {
                    String host = ((MailProperties) sendingService.getProperties()).host();
                    String eventEntityType = entity.getEventEntityType();
                    String translated = sendingService.getMessageSource().getMessage(eventEntityType + ".HEADER", null, entity.getAuthor().getLocale());

                    entity.setUrl(String.format("%s/#/Events/%s/%d", host, eventEntityType, entity.getId()));
                    entity.setEventEntityType(translated);

                    return entity;
                })
                .toList();
    }

    private Set<Class<? extends NotifiableCarEvent>> notifiableEventClasses() {
        Reflections reflections = new Reflections("pl.sztyro.carapp.model");

        Set<Class<? extends NotifiableCarEvent>> subTypes =
                reflections.getSubTypesOf(NotifiableCarEvent.class);

        return subTypes.stream()
                .filter(clazz -> !Modifier.isAbstract(clazz.getModifiers()))
                .collect(Collectors.toSet());
    }


    @Getter
    @Setter
    public final static class Params extends CarEvent {
        private String url, host, eventEntityType;


        public Params(Long id, User author, Date date, Class<? extends CarEvent> eventEntityPath){
            this.setId(id);
            this.setAuthor(author);
            this.setDate(date);
            this.eventEntityType = eventEntityPath.getCanonicalName();

        }

        public String getEventDate() {
            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
            return sdf.format(getDate());
        }

        @Override
        public String getEntityType() {
            return eventEntityType;
        }
    }
}
