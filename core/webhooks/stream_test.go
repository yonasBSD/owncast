package webhooks

import (
	"testing"
	"time"

	"github.com/owncast/owncast/core/chat/events"
	"github.com/owncast/owncast/models"
	"github.com/owncast/owncast/persistence/configrepository"
)

func TestSendStreamStatusEvent(t *testing.T) {
	configRepository := configrepository.Get()

	configRepository.SetServerName("my server")
	configRepository.SetServerSummary("my server where I stream")
	configRepository.SetStreamTitle("my stream")

	checkPayload(t, models.StreamStarted, func() {
		sendStreamStatusEvent(events.StreamStarted, "id", time.Unix(72, 6).UTC())
	}, `{
		"id": "id",
		"name": "my server",
		"streamTitle": "my stream",
		"summary": "my server where I stream",
		"timestamp": "1970-01-01T00:01:12.000000006Z",
		"status": {
			"lastConnectTime": null,
			"lastDisconnectTime": null,
			"online": true,
			"overallMaxViewerCount": 420,
			"sessionMaxViewerCount": 69,
			"streamTitle": "my stream",
			"versionNumber": "1.2.3",
			"viewerCount": 5
		}
	}`)
}
