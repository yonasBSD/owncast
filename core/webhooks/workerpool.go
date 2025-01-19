package webhooks

import (
	"bytes"
	"encoding/json"
	"net/http"
	"runtime"
	"sync"

	log "github.com/sirupsen/logrus"

	"github.com/owncast/owncast/models"
	"github.com/owncast/owncast/persistence/webhookrepository"
)

// webhookWorkerPoolSize defines the number of concurrent HTTP webhook requests.
var webhookWorkerPoolSize = runtime.GOMAXPROCS(0)

// Job struct bundling the webhook and the payload in one struct.
type Job struct {
	wg      *sync.WaitGroup
	payload WebhookEvent
	webhook models.Webhook
}

var (
	queue     chan Job
	getStatus func() models.Status
)

// SetupWebhooks initializes the webhook worker pool and sets the function to get the current status.
func SetupWebhooks(getStatusFunc func() models.Status) {
	getStatus = getStatusFunc
	initWorkerPool()
}

// initWorkerPool starts n go routines that await webhook jobs.
func initWorkerPool() {
	queue = make(chan Job)

	// start workers
	for i := 1; i <= webhookWorkerPoolSize; i++ {
		go worker(i, queue)
	}
}

func addToQueue(webhook models.Webhook, payload WebhookEvent, wg *sync.WaitGroup) {
	log.Tracef("Queued Event %s for Webhook %s", payload.Type, webhook.URL)
	queue <- Job{wg, payload, webhook}
}

func worker(workerID int, queue <-chan Job) {
	log.Debugf("Started Webhook worker %d", workerID)

	for job := range queue {
		log.Debugf("Event %s sent to Webhook %s using worker %d", job.payload.Type, job.webhook.URL, workerID)

		if err := sendWebhook(job); err != nil {
			log.Errorf("Event: %s failed to send to webhook: %s Error: %s", job.payload.Type, job.webhook.URL, err)
		}
		log.Tracef("Done with Event %s to Webhook %s using worker %d", job.payload.Type, job.webhook.URL, workerID)
		if job.wg != nil {
			job.wg.Done()
		}
	}
}

func sendWebhook(job Job) error {
	jsonText, err := json.Marshal(job.payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", job.webhook.URL, bytes.NewReader(jsonText))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	webhooksRepo := webhookrepository.Get()
	if err := webhooksRepo.SetWebhookAsUsed(job.webhook); err != nil {
		log.Warnln(err)
	}

	return nil
}
