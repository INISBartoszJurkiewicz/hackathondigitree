import urllib.request
import json
import ssl
import sys

# Webhook URL provided by the user
WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQAogkPrHI/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=GGXIFWtE-9fcEi90COFof1Cd00UuHDn7gs5uolz5uwk"

def send_deployment_notification(changes):
    """
    Sends a deployment notification to Google Chat using Card v2 format.
    """
    
    # Create the card content
    card_header = {
        "title": "🚀 Wdrożyliśmy zmiany na stronie Hackathonu",
        "subtitle": "Zmiany zostały pomyślnie opublikowane",
        "imageUrl": "https://fonts.gstatic.com/s/i/short-term/release/googlesymbols/rocket_launch/default/48px.svg",
        "imageType": "CIRCLE"
    }

    widgets = []
    
    # Add summary intro
    widgets.append({
        "textParagraph": {
            "text": "<b>Podsumowanie wdrożenia:</b><br>"
        }
    })

    # Add changes as bullet points
    changes_text = ""
    for change in changes:
        changes_text += f"• {change}<br>"
    
    widgets.append({
        "textParagraph": {
            "text": changes_text
        }
    })

    # Button to view site
    widgets.append({
        "buttonList": {
            "buttons": [
                {
                    "text": "Odwiedź stronę",
                    "onClick": {
                        "openLink": {
                            "url": "https://video.inis360.pl/HackathonAI/index.html"
                        }
                    }
                }
            ]
        }
    })

    # Construct the full payload
    card = {
        "header": card_header,
        "sections": [
            {
                "widgets": widgets
            }
        ]
    }

    payload = {
        "cardsV2": [
            {
                "cardId": "deploy-notification",
                "card": card
            }
        ]
    }

    # Send the request
    try:
        req = urllib.request.Request(
            WEBHOOK_URL,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        
        # Bypass SSL verification for this script
        context = ssl._create_unverified_context()
        
        with urllib.request.urlopen(req, context=context) as response:
            if response.status == 200:
                print("✅ Notification sent successfully!")
                return True
            else:
                print(f"❌ Failed to send notification. Status: {response.status}")
                print(response.read().decode('utf-8'))
                return False
                
    except Exception as e:
        print(f"❌ Error sending notification: {e}")
        return False

if __name__ == "__main__":
    changes_list = [
        "Zaktualizowano grafiki nagród (styl szkicu technicznego)",
        "Poprawiono opisy nagród (Pizza, Koszulka, Trofea, AI Voucher)",
        "Zastosowano efekt 'shadow ban' (silny blur) dla ukrytych członków Jury",
        "Dodano etykietę 'WKRÓTCE' na ukrytych kartach Jury"
    ]
    
    print("🚀 Initiating deployment notification...")
    send_deployment_notification(changes_list)
