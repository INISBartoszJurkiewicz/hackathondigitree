const SHEET_ID = "1lDwVSFR_9MYJfO1Fqw0RIUf7ciuwOJQCsQ4vwCkvXQE";
const SHEET_NAME = "Arkusz1"; // Or whatever the tab name is, usually Arkusz1 or Sheet1
const CHAT_WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQAogkPrHI/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=N07upYZy_g-yvPX1JrK-Vcmu8zMufyLL-emlxxjfaKw";
const ADMIN_EMAIL = "b.jurkiewicz@inis.pl";

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const data = JSON.parse(e.postData.contents);

        // SECURITY: Honeypot check
        // If the honeypot field is filled, it's a bot.
        // Return success to fool them, but do nothing.
        if (data.honeypot && data.honeypot.toString().trim() !== "") {
            return ContentService
                .createTextOutput(JSON.stringify({ "result": "success", "message": "Bot detected" }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        // 1. Save to Sheet
        saveToSheet(data);

        // 2. Send Emails
        sendConfirmationEmail(data);
        sendAdminNotification(data);

        // 3. Post to Google Chat
        postToChat(data);

        return ContentService
            .createTextOutput(JSON.stringify({ "result": "success" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({ "result": "error", "error": e }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}

function saveToSheet(data) {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0]; // Fallback to first sheet

    const timestamp = new Date();

    // Columns: Timestamp, Type, Name, Email, Idea, Team Members, Segment, Skills
    // Map data based on type
    let row = [
        timestamp,
        data.type,
        data.name,
        data.email,
        data.idea || "", // Idea (Individual or Team)
        data.teamMembers || "", // Team Members
        data.segment || "", // Segment
        data.skills || "" // Skills (Creator)
    ];

    sheet.appendRow(row);
}

function sendConfirmationEmail(data) {
    const subject = "Potwierdzenie zgłoszenia - Hack Digitree 2026";
    let body = "";

    body += "<div style='font-family: sans-serif; color: #333;'>";
    body += "<h2>Dziękujemy za zgłoszenie!</h2>";
    body += "<p>Cześć " + data.name + ",</p>";
    body += "<p>Twoje zgłoszenie na <strong>Hack Digitree 2026</strong> zostało przyjęte.</p>";
    body += "<p><strong>Typ zgłoszenia:</strong> " + translateType(data.type) + "</p>";

    if (data.idea) {
        body += "<p><strong>Twój pomysł:</strong><br>" + data.idea + "</p>";
    }

    body += "<p>Do zobaczenia na wydarzeniu!</p>";
    body += "<p><em>Zespół Hack Digitree</em></p>";
    body += "</div>";

    try {
        MailApp.sendEmail({
            to: data.email,
            subject: subject,
            htmlBody: body
        });
    } catch (e) {
        console.error("Failed to send user email", e);
    }
}

function sendAdminNotification(data) {
    // Same email to admin
    const subject = "[NOWE ZGŁOSZENIE] Hack Digitree 2026: " + data.name;

    let body = "Nowe zgłoszenie:\n";
    body += "Typ: " + data.type + "\n";
    body += "Imię: " + data.name + "\n";
    body += "Email: " + data.email + "\n";
    if (data.teamMembers) body += "Zespół: " + data.teamMembers + "\n";
    if (data.idea) body += "Pomysł: " + data.idea + "\n";
    if (data.segment) body += "Segment: " + data.segment + "\n";
    if (data.skills) body += "Umiejętności: " + data.skills + "\n";

    try {
        MailApp.sendEmail({
            to: ADMIN_EMAIL,
            subject: subject,
            body: body
        });
    } catch (e) {
        console.error("Failed to send admin email", e);
    }
}

function postToChat(data) {
    const typeLabel = translateType(data.type);

    const card = {
        "cardsV2": [
            {
                "cardId": "unique-card-id",
                "card": {
                    "header": {
                        "title": "Nowe zgłoszenie: " + data.name,
                        "subtitle": typeLabel,
                        "imageUrl": "https://cdn-icons-png.flaticon.com/512/2921/2921222.png", // Generic user icon
                        "imageType": "CIRCLE"
                    },
                    "sections": [
                        {
                            "header": "Szczegóły",
                            "widgets": [
                                {
                                    "textParagraph": {
                                        "text": "<b>Email:</b> " + data.email
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    };

    // Add conditional fields to widget list
    const widgets = card.cardsV2[0].card.sections[0].widgets;

    if (data.teamMembers) {
        widgets.push({ "textParagraph": { "text": "<b>Zespół:</b> " + data.teamMembers } });
    }
    if (data.segment) {
        widgets.push({ "textParagraph": { "text": "<b>Segment:</b> " + data.segment } });
    }
    if (data.idea) {
        widgets.push({ "textParagraph": { "text": "<b>Pomysł:</b> " + data.idea } });
    }
    if (data.skills) {
        widgets.push({ "textParagraph": { "text": "<b>Umiejętności:</b> " + data.skills } });
    }

    const options = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(card)
    };

    try {
        UrlFetchApp.fetch(CHAT_WEBHOOK_URL, options);
    } catch (e) {
        console.error("Failed to post to chat", e);
    }
}

function translateType(type) {
    switch (type) {
        case 'team': return 'Zespół';
        case 'individual': return 'Indywidualnie';
        case 'creator': return 'Creator (Szukam zespołu)';
        default: return type;
    }
}
