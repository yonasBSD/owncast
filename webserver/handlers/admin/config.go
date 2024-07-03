package admin

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"net/netip"
	"os"
	"path/filepath"
	"reflect"
	"strings"

	"github.com/owncast/owncast/activitypub/outbox"
	"github.com/owncast/owncast/core/chat"
	"github.com/owncast/owncast/core/data"
	"github.com/owncast/owncast/core/webhooks"
	"github.com/owncast/owncast/models"
	"github.com/owncast/owncast/utils"
	"github.com/owncast/owncast/webserver/handlers/generated"
	webutils "github.com/owncast/owncast/webserver/utils"
	log "github.com/sirupsen/logrus"
	"github.com/teris-io/shortid"
)

// ConfigValue is a container object that holds a value, is encoded, and saved to the database.
type ConfigValue struct {
	Value interface{} `json:"value"`
}

// SetTags will handle the web config request to set tags.
func SetTags(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValues, success := getValuesFromRequest(w, r)
	if !success {
		return
	}

	tagStrings := make([]string, 0)
	for _, tag := range configValues {
		tagStrings = append(tagStrings, strings.TrimLeft(tag.Value.(string), "#"))
	}

	if err := data.SetServerMetadataTags(tagStrings); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	// Update Fediverse followers about this change.
	if err := outbox.UpdateFollowersWithAccountUpdates(); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "changed")
}

// SetStreamTitle will handle the web config request to set the current stream title.
func SetStreamTitle(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	value := configValue.Value.(string)

	if err := data.SetStreamTitle(value); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}
	if value != "" {
		sendSystemChatAction(fmt.Sprintf("Stream title changed to **%s**", value), true)
		go webhooks.SendStreamStatusEvent(models.StreamTitleUpdated)
	}
	webutils.WriteSimpleResponse(w, true, "changed")
}

// ExternalSetStreamTitle will change the stream title on behalf of an external integration API request.
func ExternalSetStreamTitle(integration models.ExternalAPIUser, w http.ResponseWriter, r *http.Request) {
	SetStreamTitle(w, r)
}

func sendSystemChatAction(messageText string, ephemeral bool) {
	if err := chat.SendSystemAction(messageText, ephemeral); err != nil {
		log.Errorln(err)
	}
}

// SetServerName will handle the web config request to set the server's name.
func SetServerName(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if err := data.SetServerName(configValue.Value.(string)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	// Update Fediverse followers about this change.
	if err := outbox.UpdateFollowersWithAccountUpdates(); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "changed")
}

// SetServerSummary will handle the web config request to set the about/summary text.
func SetServerSummary(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if err := data.SetServerSummary(configValue.Value.(string)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	// Update Fediverse followers about this change.
	if err := outbox.UpdateFollowersWithAccountUpdates(); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "changed")
}

// SetCustomOfflineMessage will set a message to display when the server is offline.
func SetCustomOfflineMessage(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if err := data.SetCustomOfflineMessage(strings.TrimSpace(configValue.Value.(string))); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "changed")
}

// SetServerWelcomeMessage will handle the web config request to set the welcome message text.
func SetServerWelcomeMessage(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if err := data.SetServerWelcomeMessage(strings.TrimSpace(configValue.Value.(string))); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "changed")
}

// SetExtraPageContent will handle the web config request to set the page markdown content.
func SetExtraPageContent(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if err := data.SetExtraPageBodyContent(configValue.Value.(string)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "changed")
}

// SetAdminPassword will handle the web config request to set the server admin password.
func SetAdminPassword(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if err := data.SetAdminPassword(configValue.Value.(string)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "changed")
}

// SetLogo will handle a new logo image file being uploaded.
func SetLogo(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	value, ok := configValue.Value.(string)
	if !ok {
		webutils.WriteSimpleResponse(w, false, "unable to find image data")
		return
	}
	bytes, extension, err := utils.DecodeBase64Image(value)
	if err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	imgPath := filepath.Join("data", "logo"+extension)
	if err := os.WriteFile(imgPath, bytes, 0o600); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	if err := data.SetLogoPath("logo" + extension); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	if err := data.SetLogoUniquenessString(shortid.MustGenerate()); err != nil {
		log.Error("Error saving logo uniqueness string: ", err)
	}

	// Update Fediverse followers about this change.
	if err := outbox.UpdateFollowersWithAccountUpdates(); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "changed")
}

// SetNSFW will handle the web config request to set the NSFW flag.
func SetNSFW(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if err := data.SetNSFW(configValue.Value.(bool)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "changed")
}

// SetFfmpegPath will handle the web config request to validate and set an updated copy of ffmpg.
func SetFfmpegPath(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	path := configValue.Value.(string)
	if err := utils.VerifyFFMpegPath(path); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	if err := data.SetFfmpegPath(configValue.Value.(string)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "changed")
}

// SetWebServerPort will handle the web config request to set the server's HTTP port.
func SetWebServerPort(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if port, ok := configValue.Value.(float64); ok {
		if (port < 1) || (port > 65535) {
			webutils.WriteSimpleResponse(w, false, "Port number must be between 1 and 65535")
			return
		}
		if err := data.SetHTTPPortNumber(port); err != nil {
			webutils.WriteSimpleResponse(w, false, err.Error())
			return
		}

		webutils.WriteSimpleResponse(w, true, "HTTP port set")
		return
	}

	webutils.WriteSimpleResponse(w, false, "Invalid type or value, port must be a number")
}

// SetWebServerIP will handle the web config request to set the server's HTTP listen address.
func SetWebServerIP(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if input, ok := configValue.Value.(string); ok {
		if ip := net.ParseIP(input); ip != nil {
			if err := data.SetHTTPListenAddress(ip.String()); err != nil {
				webutils.WriteSimpleResponse(w, false, err.Error())
				return
			}

			webutils.WriteSimpleResponse(w, true, "HTTP listen address set")
			return
		}

		webutils.WriteSimpleResponse(w, false, "Invalid IP address")
		return
	}
	webutils.WriteSimpleResponse(w, false, "Invalid type or value, IP address must be a string")
}

// SetRTMPServerPort will handle the web config request to set the inbound RTMP port.
func SetRTMPServerPort(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if err := data.SetRTMPPortNumber(configValue.Value.(float64)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "rtmp port set")
}

// SetServerURL will handle the web config request to set the full server URL.
func SetServerURL(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	rawValue, ok := configValue.Value.(string)
	if !ok {
		webutils.WriteSimpleResponse(w, false, "could not read server url")
		return
	}

	serverHostString := utils.GetHostnameFromURLString(rawValue)
	if serverHostString == "" {
		webutils.WriteSimpleResponse(w, false, "server url value invalid")
		return
	}

	// Block Private IP URLs
	ipAddr, ipErr := netip.ParseAddr(utils.GetHostnameWithoutPortFromURLString(rawValue))

	if ipErr == nil && ipAddr.IsPrivate() {
		webutils.WriteSimpleResponse(w, false, "Server URL cannot be private")
		return
	}

	// Trim any trailing slash
	serverURL := strings.TrimRight(rawValue, "/")

	if err := data.SetServerURL(serverURL); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "server url set")
}

// SetSocketHostOverride will set the host override for the websocket.
func SetSocketHostOverride(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if err := data.SetWebsocketOverrideHost(configValue.Value.(string)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "websocket host override set")
}

// SetDirectoryEnabled will handle the web config request to enable or disable directory registration.
func SetDirectoryEnabled(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if err := data.SetDirectoryEnabled(configValue.Value.(bool)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}
	webutils.WriteSimpleResponse(w, true, "directory state changed")
}

// SetStreamLatencyLevel will handle the web config request to set the stream latency level.
func SetStreamLatencyLevel(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if err := data.SetStreamLatencyLevel(configValue.Value.(float64)); err != nil {
		webutils.WriteSimpleResponse(w, false, "error setting stream latency "+err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "set stream latency")
}

// SetS3Configuration will handle the web config request to set the storage configuration.
func SetS3Configuration(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	type s3ConfigurationRequest struct {
		Value models.S3 `json:"value"`
	}

	decoder := json.NewDecoder(r.Body)
	var newS3Config s3ConfigurationRequest
	if err := decoder.Decode(&newS3Config); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update s3 config with provided values")
		return
	}

	if newS3Config.Value.Enabled {
		if newS3Config.Value.Endpoint == "" || !utils.IsValidURL((newS3Config.Value.Endpoint)) {
			webutils.WriteSimpleResponse(w, false, "s3 support requires an endpoint")
			return
		}

		if newS3Config.Value.AccessKey == "" || newS3Config.Value.Secret == "" {
			webutils.WriteSimpleResponse(w, false, "s3 support requires an access key and secret")
			return
		}

		if newS3Config.Value.Region == "" {
			webutils.WriteSimpleResponse(w, false, "s3 support requires a region and endpoint")
			return
		}

		if newS3Config.Value.Bucket == "" {
			webutils.WriteSimpleResponse(w, false, "s3 support requires a bucket created for storing public video segments")
			return
		}
	}

	if err := data.SetS3Config(newS3Config.Value); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}
	webutils.WriteSimpleResponse(w, true, "storage configuration changed")
}

// SetStreamOutputVariants will handle the web config request to set the video output stream variants.
func SetStreamOutputVariants(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	type streamOutputVariantRequest struct {
		Value []models.StreamOutputVariant `json:"value"`
	}

	decoder := json.NewDecoder(r.Body)
	var videoVariants streamOutputVariantRequest
	if err := decoder.Decode(&videoVariants); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update video config with provided values "+err.Error())
		return
	}

	if err := data.SetStreamOutputVariants(videoVariants.Value); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update video config with provided values "+err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "stream output variants updated")
}

// SetSocialHandles will handle the web config request to set the external social profile links.
func SetSocialHandles(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	type socialHandlesRequest struct {
		Value []models.SocialHandle `json:"value"`
	}

	decoder := json.NewDecoder(r.Body)
	var socialHandles socialHandlesRequest
	if err := decoder.Decode(&socialHandles); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update social handles with provided values")
		return
	}

	if err := data.SetSocialHandles(socialHandles.Value); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update social handles with provided values")
		return
	}

	// Update Fediverse followers about this change.
	if err := outbox.UpdateFollowersWithAccountUpdates(); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "social handles updated")
}

// SetChatDisabled will disable chat functionality.
func SetChatDisabled(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		webutils.WriteSimpleResponse(w, false, "unable to update chat disabled")
		return
	}

	if err := data.SetChatDisabled(configValue.Value.(bool)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "chat disabled status updated")
}

// SetVideoCodec will change the codec used for video encoding.
func SetVideoCodec(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		webutils.WriteSimpleResponse(w, false, "unable to change video codec")
		return
	}

	if err := data.SetVideoCodec(configValue.Value.(string)); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update codec")
		return
	}

	webutils.WriteSimpleResponse(w, true, "video codec updated")
}

// SetExternalActions will set the 3rd party actions for the web interface.
func SetExternalActions(w http.ResponseWriter, r *http.Request) {
	type externalActionsRequest struct {
		Value []models.ExternalAction `json:"value"`
	}

	decoder := json.NewDecoder(r.Body)
	var actions externalActionsRequest
	if err := decoder.Decode(&actions); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update external actions with provided values")
		return
	}

	if err := data.SetExternalActions(actions.Value); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update external actions with provided values")
		return
	}

	webutils.WriteSimpleResponse(w, true, "external actions update")
}

// SetCustomStyles will set the CSS string we insert into the page.
func SetCustomStyles(w http.ResponseWriter, r *http.Request) {
	customStyles, success := getValueFromRequest(w, r)
	if !success {
		webutils.WriteSimpleResponse(w, false, "unable to update custom styles")
		return
	}

	if err := data.SetCustomStyles(customStyles.Value.(string)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "custom styles updated")
}

// SetCustomJavascript will set the Javascript string we insert into the page.
func SetCustomJavascript(w http.ResponseWriter, r *http.Request) {
	customJavascript, success := getValueFromRequest(w, r)
	if !success {
		webutils.WriteSimpleResponse(w, false, "unable to update custom javascript")
		return
	}

	if err := data.SetCustomJavascript(customJavascript.Value.(string)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "custom styles updated")
}

// SetForbiddenUsernameList will set the list of usernames we do not allow to use.
func SetForbiddenUsernameList(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var request generated.SetForbiddenUsernameListJSONBody

	if err := decoder.Decode(&request); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update forbidden usernames with provided values")
		return
	}

	if err := data.SetForbiddenUsernameList(*request.Value); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "forbidden username list updated")
}

// SetSuggestedUsernameList will set the list of suggested usernames that newly registered users are assigned if it isn't inferred otherwise (i.e. through a proxy).
func SetSuggestedUsernameList(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var request generated.SetSuggestedUsernameListJSONBody

	if err := decoder.Decode(&request); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update suggested usernames with provided values")
		return
	}

	if err := data.SetSuggestedUsernamesList(*request.Value); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "suggested username list updated")
}

// SetChatJoinMessagesEnabled will enable or disable the chat join messages.
func SetChatJoinMessagesEnabled(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		webutils.WriteSimpleResponse(w, false, "unable to update chat join messages enabled")
		return
	}

	if err := data.SetChatJoinMessagesEnabled(configValue.Value.(bool)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "chat join message status updated")
}

// SetHideViewerCount will enable or disable hiding the viewer count.
func SetHideViewerCount(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		webutils.WriteSimpleResponse(w, false, "unable to update hiding viewer count")
		return
	}

	if err := data.SetHideViewerCount(configValue.Value.(bool)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "hide viewer count setting updated")
}

// SetDisableSearchIndexing will set search indexing support.
func SetDisableSearchIndexing(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		webutils.WriteSimpleResponse(w, false, "unable to update search indexing")
		return
	}

	if err := data.SetDisableSearchIndexing(configValue.Value.(bool)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "search indexing support updated")
}

// SetVideoServingEndpoint will save the video serving endpoint.
func SetVideoServingEndpoint(w http.ResponseWriter, r *http.Request) {
	endpoint, success := getValueFromRequest(w, r)
	if !success {
		webutils.WriteSimpleResponse(w, false, "unable to update custom video serving endpoint")
		return
	}

	value, ok := endpoint.Value.(string)
	if !ok {
		webutils.WriteSimpleResponse(w, false, "unable to update custom video serving endpoint")
		return
	}

	if err := data.SetVideoServingEndpoint(value); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "custom video serving endpoint updated")
}

// SetChatSpamProtectionEnabled will enable or disable the chat spam protection.
func SetChatSpamProtectionEnabled(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if err := data.SetChatSpamProtectionEnabled(configValue.Value.(bool)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}
	webutils.WriteSimpleResponse(w, true, "chat spam protection changed")
}

// SetChatSlurFilterEnabled will enable or disable the chat slur filter.
func SetChatSlurFilterEnabled(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	configValue, success := getValueFromRequest(w, r)
	if !success {
		return
	}

	if err := data.SetChatSlurFilterEnabled(configValue.Value.(bool)); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}
	webutils.WriteSimpleResponse(w, true, "chat message slur filter changed")
}

func requirePOST(w http.ResponseWriter, r *http.Request) bool {
	if r.Method != http.MethodPost {
		webutils.WriteSimpleResponse(w, false, r.Method+" not supported")
		return false
	}

	return true
}

func getValueFromRequest(w http.ResponseWriter, r *http.Request) (ConfigValue, bool) {
	decoder := json.NewDecoder(r.Body)
	var configValue ConfigValue
	if err := decoder.Decode(&configValue); err != nil {
		log.Warnln(err)
		webutils.WriteSimpleResponse(w, false, "unable to parse new value")
		return configValue, false
	}

	return configValue, true
}

func getValuesFromRequest(w http.ResponseWriter, r *http.Request) ([]ConfigValue, bool) {
	var values []ConfigValue

	decoder := json.NewDecoder(r.Body)
	var configValue ConfigValue
	if err := decoder.Decode(&configValue); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to parse array of values")
		return values, false
	}

	object := reflect.ValueOf(configValue.Value)

	for i := 0; i < object.Len(); i++ {
		values = append(values, ConfigValue{Value: object.Index(i).Interface()})
	}

	return values, true
}

// SetStreamKeys will set the valid stream keys.
func SetStreamKeys(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	type streamKeysRequest struct {
		Value []models.StreamKey `json:"value"`
	}

	decoder := json.NewDecoder(r.Body)
	var streamKeys streamKeysRequest
	if err := decoder.Decode(&streamKeys); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update stream keys with provided values")
		return
	}

	if len(streamKeys.Value) == 0 {
		webutils.WriteSimpleResponse(w, false, "must provide at least one valid stream key")
		return
	}

	for _, streamKey := range streamKeys.Value {
		if streamKey.Key == "" {
			webutils.WriteSimpleResponse(w, false, "stream key cannot be empty")
			return
		}
	}

	if err := data.SetStreamKeys(streamKeys.Value); err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteSimpleResponse(w, true, "changed")
}
