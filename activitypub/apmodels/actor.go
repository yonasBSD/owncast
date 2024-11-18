package apmodels

import (
	"errors"
	"fmt"
	"net/url"
	"time"

	"github.com/go-fed/activity/streams"
	"github.com/go-fed/activity/streams/vocab"
	"github.com/owncast/owncast/activitypub/crypto"
	"github.com/owncast/owncast/models"
	"github.com/owncast/owncast/persistence/configrepository"
	log "github.com/sirupsen/logrus"
)

// ActivityPubActor represents a single actor in handling ActivityPub activity.
type ActivityPubActor struct {
	// RequestObject is the actual follow request object.
	RequestObject vocab.ActivityStreamsFollow
	// W3IDSecurityV1PublicKey is the public key of the actor.
	W3IDSecurityV1PublicKey vocab.W3IDSecurityV1PublicKeyProperty
	// ActorIRI is the IRI of the remote actor.
	ActorIri *url.URL
	// FollowRequestIRI is the unique identifier of the follow request.
	FollowRequestIri *url.URL
	// Inbox is the inbox URL of the remote follower
	Inbox *url.URL
	// Image is the avatar image of the Actor.
	Image *url.URL
	// DisabledAt is the time, if any, this follower was blocked/removed.
	DisabledAt *time.Time
	// Name is the display name of the follower.
	Name string
	// Username is the account username of the remote actor.
	Username string
	// FullUsername is the username@account.tld representation of the user.
	FullUsername string
}

// DeleteRequest represents a request for delete.
type DeleteRequest struct {
	ActorIri string
}

// ExternalEntity represents an ActivityPub Person, Service or Application.
type ExternalEntity interface {
	GetJSONLDId() vocab.JSONLDIdProperty
	GetActivityStreamsInbox() vocab.ActivityStreamsInboxProperty
	GetActivityStreamsName() vocab.ActivityStreamsNameProperty
	GetActivityStreamsPreferredUsername() vocab.ActivityStreamsPreferredUsernameProperty
	GetActivityStreamsIcon() vocab.ActivityStreamsIconProperty
	GetW3IDSecurityV1PublicKey() vocab.W3IDSecurityV1PublicKeyProperty
}

// MakeActorFromExernalAPEntity takes a full ActivityPub entity and returns our
// internal representation of an actor.
func MakeActorFromExernalAPEntity(entity ExternalEntity) (*ActivityPubActor, error) {
	// Username is required (but not a part of the official ActivityPub spec)
	if entity.GetActivityStreamsPreferredUsername() == nil || entity.GetActivityStreamsPreferredUsername().GetXMLSchemaString() == "" {
		return nil, errors.New("remote activitypub entity does not have a preferred username set, rejecting")
	}
	username := GetFullUsernameFromExternalEntity(entity)

	// Key is required
	if entity.GetW3IDSecurityV1PublicKey() == nil {
		return nil, errors.New("remote activitypub entity does not have a public key set, rejecting")
	}

	// Name is optional
	var name string
	if entity.GetActivityStreamsName() != nil && !entity.GetActivityStreamsName().Empty() {
		name = entity.GetActivityStreamsName().At(0).GetXMLSchemaString()
	}

	// Image is optional
	var image *url.URL
	if entity.GetActivityStreamsIcon() != nil && !entity.GetActivityStreamsIcon().Empty() && entity.GetActivityStreamsIcon().At(0).GetActivityStreamsImage() != nil {
		image = entity.GetActivityStreamsIcon().At(0).GetActivityStreamsImage().GetActivityStreamsUrl().Begin().GetIRI()
	}

	apActor := ActivityPubActor{
		ActorIri:                entity.GetJSONLDId().Get(),
		Inbox:                   entity.GetActivityStreamsInbox().GetIRI(),
		Name:                    name,
		Username:                entity.GetActivityStreamsPreferredUsername().GetXMLSchemaString(),
		FullUsername:            username,
		W3IDSecurityV1PublicKey: entity.GetW3IDSecurityV1PublicKey(),
		Image:                   image,
	}

	return &apActor, nil
}

// MakeActorPropertyWithID will return an actor property filled with the provided IRI.
func MakeActorPropertyWithID(idIRI *url.URL) vocab.ActivityStreamsActorProperty {
	actor := streams.NewActivityStreamsActorProperty()
	actor.AppendIRI(idIRI)
	return actor
}

// MakeServiceForAccount will create a new local actor service with the the provided username.
func MakeServiceForAccount(accountName string) vocab.ActivityStreamsService {
	configRepository := configrepository.Get()

	actorIRI := MakeLocalIRIForAccount(accountName)

	person := streams.NewActivityStreamsService()
	nameProperty := streams.NewActivityStreamsNameProperty()
	nameProperty.AppendXMLSchemaString(configRepository.GetServerName())
	person.SetActivityStreamsName(nameProperty)

	preferredUsernameProperty := streams.NewActivityStreamsPreferredUsernameProperty()
	preferredUsernameProperty.SetXMLSchemaString(accountName)
	person.SetActivityStreamsPreferredUsername(preferredUsernameProperty)

	inboxIRI := MakeLocalIRIForResource("/user/" + accountName + "/inbox")

	inboxProp := streams.NewActivityStreamsInboxProperty()
	inboxProp.SetIRI(inboxIRI)
	person.SetActivityStreamsInbox(inboxProp)

	needsFollowApprovalProperty := streams.NewActivityStreamsManuallyApprovesFollowersProperty()
	needsFollowApprovalProperty.Set(configRepository.GetFederationIsPrivate())
	person.SetActivityStreamsManuallyApprovesFollowers(needsFollowApprovalProperty)

	outboxIRI := MakeLocalIRIForResource("/user/" + accountName + "/outbox")

	outboxProp := streams.NewActivityStreamsOutboxProperty()
	outboxProp.SetIRI(outboxIRI)
	person.SetActivityStreamsOutbox(outboxProp)

	id := streams.NewJSONLDIdProperty()
	id.Set(actorIRI)
	person.SetJSONLDId(id)

	publicKey := crypto.GetPublicKey(actorIRI)

	publicKeyProp := streams.NewW3IDSecurityV1PublicKeyProperty()
	publicKeyType := streams.NewW3IDSecurityV1PublicKey()

	pubKeyIDProp := streams.NewJSONLDIdProperty()
	pubKeyIDProp.Set(publicKey.ID)

	publicKeyType.SetJSONLDId(pubKeyIDProp)

	ownerProp := streams.NewW3IDSecurityV1OwnerProperty()
	ownerProp.SetIRI(publicKey.Owner)
	publicKeyType.SetW3IDSecurityV1Owner(ownerProp)

	publicKeyPemProp := streams.NewW3IDSecurityV1PublicKeyPemProperty()
	publicKeyPemProp.Set(publicKey.PublicKeyPem)
	publicKeyType.SetW3IDSecurityV1PublicKeyPem(publicKeyPemProp)
	publicKeyProp.AppendW3IDSecurityV1PublicKey(publicKeyType)
	person.SetW3IDSecurityV1PublicKey(publicKeyProp)

	if t, err := configRepository.GetServerInitTime(); t != nil {
		publishedDateProp := streams.NewActivityStreamsPublishedProperty()
		publishedDateProp.Set(t.Time)
		person.SetActivityStreamsPublished(publishedDateProp)
	} else {
		log.Errorln("unable to fetch server init time", err)
	}

	// Profile properties

	// Avatar
	uniquenessString := configRepository.GetLogoUniquenessString()
	userAvatarURLString := configRepository.GetServerURL() + "/logo/external"
	userAvatarURL, err := url.Parse(userAvatarURLString)
	userAvatarURL.RawQuery = "uc=" + uniquenessString
	if err != nil {
		log.Errorln("unable to parse user avatar url", userAvatarURLString, err)
	}

	image := streams.NewActivityStreamsImage()
	imgProp := streams.NewActivityStreamsUrlProperty()
	imgProp.AppendIRI(userAvatarURL)
	image.SetActivityStreamsUrl(imgProp)
	icon := streams.NewActivityStreamsIconProperty()
	icon.AppendActivityStreamsImage(image)
	person.SetActivityStreamsIcon(icon)

	// Actor  URL
	urlProperty := streams.NewActivityStreamsUrlProperty()
	urlProperty.AppendIRI(actorIRI)
	person.SetActivityStreamsUrl(urlProperty)

	// Profile header
	headerImage := streams.NewActivityStreamsImage()
	headerImgPropURL := streams.NewActivityStreamsUrlProperty()
	headerImgPropURL.AppendIRI(userAvatarURL)
	headerImage.SetActivityStreamsUrl(headerImgPropURL)
	headerImageProp := streams.NewActivityStreamsImageProperty()
	headerImageProp.AppendActivityStreamsImage(headerImage)
	person.SetActivityStreamsImage(headerImageProp)

	// Profile bio
	summaryProperty := streams.NewActivityStreamsSummaryProperty()
	summaryProperty.AppendXMLSchemaString(configRepository.GetServerSummary())
	person.SetActivityStreamsSummary(summaryProperty)

	// Links
	if serverURL := configRepository.GetServerURL(); serverURL != "" {
		addMetadataLinkToProfile(person, "Stream", serverURL)
	}
	for _, link := range configRepository.GetSocialHandles() {
		addMetadataLinkToProfile(person, link.Platform, link.URL)
	}

	// Discoverable
	discoverableProperty := streams.NewTootDiscoverableProperty()
	discoverableProperty.Set(true)
	person.SetTootDiscoverable(discoverableProperty)

	// Followers
	followersProperty := streams.NewActivityStreamsFollowersProperty()
	followersURL := *actorIRI
	followersURL.Path = actorIRI.Path + "/followers"
	followersProperty.SetIRI(&followersURL)
	person.SetActivityStreamsFollowers(followersProperty)

	// Tags
	tagProp := streams.NewActivityStreamsTagProperty()
	for _, tagString := range configRepository.GetServerMetadataTags() {
		hashtag := MakeHashtag(tagString)
		tagProp.AppendTootHashtag(hashtag)
	}

	person.SetActivityStreamsTag(tagProp)

	// Work around an issue where a single attachment will not serialize
	// as an array, so add another item to the mix.
	if len(configRepository.GetSocialHandles()) == 1 {
		addMetadataLinkToProfile(person, "Owncast", "https://owncast.online")
	}

	return person
}

// GetFullUsernameFromExternalEntity will return the full username from an
// internal representation of an ExternalEntity. Returns user@host.tld.
func GetFullUsernameFromExternalEntity(entity ExternalEntity) string {
	hostname := entity.GetJSONLDId().GetIRI().Hostname()
	username := entity.GetActivityStreamsPreferredUsername().GetXMLSchemaString()
	fullUsername := fmt.Sprintf("%s@%s", username, hostname)

	return fullUsername
}

func addMetadataLinkToProfile(profile vocab.ActivityStreamsService, name string, url string) {
	attachments := profile.GetActivityStreamsAttachment()
	if attachments == nil {
		attachments = streams.NewActivityStreamsAttachmentProperty()
	}

	displayName := name
	socialHandle := models.GetSocialHandle(name)
	if socialHandle != nil {
		displayName = socialHandle.Platform
	}

	linkValue := fmt.Sprintf("<a href=\"%s\" rel=\"me nofollow noopener noreferrer\" target=\"_blank\">%s</a>", url, url)

	attachment := streams.NewActivityStreamsObject()
	attachmentProp := streams.NewJSONLDTypeProperty()
	attachmentProp.AppendXMLSchemaString("PropertyValue")
	attachment.SetJSONLDType(attachmentProp)
	attachmentName := streams.NewActivityStreamsNameProperty()
	attachmentName.AppendXMLSchemaString(displayName)
	attachment.SetActivityStreamsName(attachmentName)
	attachment.GetUnknownProperties()["value"] = linkValue

	attachments.AppendActivityStreamsObject(attachment)
	profile.SetActivityStreamsAttachment(attachments)
}
