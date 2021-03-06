package com.money.management.notification.service;

import com.money.management.notification.NotificationServiceApplication;
import com.money.management.notification.domain.NotificationType;
import com.money.management.notification.domain.Recipient;
import com.money.management.notification.util.RecipientUtil;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.initMocks;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = NotificationServiceApplication.class)
@WebAppConfiguration
public class EmailServiceImplTest {
    private final String subject = "subject";
    private final String text = "text";
    private final Recipient recipient = RecipientUtil.getRecipient(null);

    @InjectMocks
    private EmailServiceImpl emailService;

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private Environment env;

    @Captor
    private ArgumentCaptor<MimeMessage> captor;

    @Before
    public void setup() {
        initMocks(this);
        when(mailSender.createMimeMessage())
                .thenReturn(new MimeMessage(Session.getDefaultInstance(new Properties())));
    }

    @Test
    public void shouldSendBackupEmail() throws MessagingException {
        String attachment = "attachment.json";

        when(env.getProperty(NotificationType.BACKUP.getSubject())).thenReturn(subject);
        when(env.getProperty(NotificationType.BACKUP.getText())).thenReturn(text);
        when(env.getProperty(NotificationType.BACKUP.getAttachment())).thenReturn(attachment);

        emailService.send(NotificationType.BACKUP, recipient, "{\"name\":\"test\"");

        verify(mailSender).send(captor.capture());

        MimeMessage message = captor.getValue();
        assertEquals(subject, message.getSubject());
    }

    @Test
    public void shouldSendRemindEmail() throws MessagingException {
        when(env.getProperty(NotificationType.REMIND.getSubject())).thenReturn(subject);
        when(env.getProperty(NotificationType.REMIND.getText())).thenReturn(text);

        emailService.send(NotificationType.REMIND, recipient, null);

        verify(mailSender).send(captor.capture());

        MimeMessage message = captor.getValue();
        assertEquals(subject, message.getSubject());
    }
}