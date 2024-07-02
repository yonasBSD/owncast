package webhooks

import (
	"sync"
	"time"

	"github.com/owncast/owncast/core/data"
	"github.com/owncast/owncast/models"
)

// WebhookEvent represents an event sent as a webhook.
type WebhookEvent struct {
	EventData interface{}      `json:"eventData,omitempty"`
	Type      models.EventType `json:"type"` // messageSent | userJoined | userNameChange
}

// WebhookChatMessage represents a single chat message sent as a webhook payload.
type WebhookChatMessage struct {
	User      *models.User `json:"user,omitempty"`
	Timestamp *time.Time   `json:"timestamp,omitempty"`
	Body      string       `json:"body,omitempty"`
	RawBody   string       `json:"rawBody,omitempty"`
	ID        string       `json:"id,omitempty"`
	ClientID  uint         `json:"clientId,omitempty"`
	Visible   bool         `json:"visible"`
}

// SendEventToWebhooks will send a single webhook event to all webhook destinations.
func SendEventToWebhooks(payload WebhookEvent) {
	sendEventToWebhooks(payload, nil)
}

func sendEventToWebhooks(payload WebhookEvent, wg *sync.WaitGroup) {
	webhooks := data.GetWebhooksForEvent(payload.Type)

	for _, webhook := range webhooks {
		// Use wg to track the number of notifications to be sent.
		if wg != nil {
			wg.Add(1)
		}
		addToQueue(webhook, payload, wg)
	}
}
