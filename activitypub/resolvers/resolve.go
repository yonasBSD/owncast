package resolvers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/go-fed/activity/streams"
	"github.com/go-fed/activity/streams/vocab"
	"github.com/owncast/owncast/activitypub/apmodels"
	"github.com/owncast/owncast/activitypub/crypto"
	"github.com/owncast/owncast/persistence/configrepository"
	"github.com/pkg/errors"
	log "github.com/sirupsen/logrus"
)

// Resolve will translate a raw ActivityPub payload and fire the callback associated with that activity type.
func Resolve(c context.Context, data []byte, callbacks ...interface{}) error {
	jsonResolver, err := streams.NewJSONResolver(callbacks...)
	if err != nil {
		// Something in the setup was wrong. For example, a callback has an
		// unsupported signature and would never be called
		return err
	}

	var jsonMap map[string]interface{}
	if err = json.Unmarshal(data, &jsonMap); err != nil {
		return err
	}

	log.Debugln("Resolving payload...", string(data))

	// The createCallback function will be called.
	err = jsonResolver.Resolve(c, jsonMap)
	if err != nil && !streams.IsUnmatchedErr(err) {
		// Something went wrong
		return err
	} else if streams.IsUnmatchedErr(err) {
		// Everything went right but the callback didn't match or the ActivityStreams
		// type is one that wasn't code generated.
		log.Debugln("No match: ", err)
	}

	return nil
}

// ResolveIRI will resolve an IRI ahd call the correct callback for the resolved type.
func ResolveIRI(c context.Context, iri string, callbacks ...interface{}) error {
	configRepository := configrepository.Get()
	log.Debugln("Resolving", iri)

	req, _ := http.NewRequest(http.MethodGet, iri, nil)

	actor := apmodels.MakeLocalIRIForAccount(configRepository.GetDefaultFederationUsername())
	if err := crypto.SignRequest(req, nil, actor); err != nil {
		return err
	}

	response, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	defer response.Body.Close()

	data, err := io.ReadAll(response.Body)
	if err != nil {
		return err
	}

	// fmt.Println(string(data))
	return Resolve(c, data, callbacks...)
}

// GetResolvedActorFromActorProperty resolve an external actor property to a
// fully populated internal actor representation.
func GetResolvedActorFromActorProperty(actor vocab.ActivityStreamsActorProperty) (apmodels.ActivityPubActor, error) {
	var err error
	var apActor apmodels.ActivityPubActor
	resolved := false

	if !actor.Empty() && actor.Len() > 0 && actor.At(0) != nil {
		// Explicitly use only the first actor that might be listed.
		actorObjectOrIRI := actor.At(0)
		var actorEntity apmodels.ExternalEntity

		// If the actor is an unresolved IRI then we need to resolve it.
		if actorObjectOrIRI.IsIRI() {
			iri := actorObjectOrIRI.GetIRI().String()
			return GetResolvedActorFromIRI(iri)
		}

		if actorObjectOrIRI.IsActivityStreamsPerson() {
			actorEntity = actorObjectOrIRI.GetActivityStreamsPerson()
		} else if actorObjectOrIRI.IsActivityStreamsService() {
			actorEntity = actorObjectOrIRI.GetActivityStreamsService()
		} else if actorObjectOrIRI.IsActivityStreamsApplication() {
			actorEntity = actorObjectOrIRI.GetActivityStreamsApplication()
		} else {
			err = errors.New("unrecognized external ActivityPub type: " + actorObjectOrIRI.Name())
			return apActor, err
		}

		// If any of the resolution or population failed then return the error.
		if err != nil {
			return apActor, err
		}

		// Convert the external AP entity into an internal actor representation.
		apa, e := apmodels.MakeActorFromExernalAPEntity(actorEntity)
		if apa != nil {
			apActor = *apa
			resolved = true
		}
		err = e
	}

	if !resolved && err == nil {
		err = errors.New("unknown error resolving actor from property value")
	}

	return apActor, err
}

// GetResolvedPublicKeyFromIRI will resolve a publicKey IRI string to a vocab.W3IDSecurityV1PublicKey.
func GetResolvedPublicKeyFromIRI(publicKeyIRI string) (vocab.W3IDSecurityV1PublicKey, error) {
	var err error
	var pubkey vocab.W3IDSecurityV1PublicKey
	resolved := false

	personCallback := func(c context.Context, person vocab.ActivityStreamsPerson) error {
		if pkProp := person.GetW3IDSecurityV1PublicKey(); pkProp != nil {
			for iter := pkProp.Begin(); iter != pkProp.End(); iter = iter.Next() {
				if iter.IsW3IDSecurityV1PublicKey() {
					pubkey = iter.Get()
					resolved = true
					return nil
				}
			}
		}
		return errors.New("error deriving publickey from activitystreamsperson")
	}

	serviceCallback := func(c context.Context, service vocab.ActivityStreamsService) error {
		if pkProp := service.GetW3IDSecurityV1PublicKey(); pkProp != nil {
			for iter := pkProp.Begin(); iter != pkProp.End(); iter = iter.Next() {
				if iter.IsW3IDSecurityV1PublicKey() {
					pubkey = iter.Get()
					resolved = true
					return nil
				}
			}
		}
		return errors.New("error deriving publickey from activitystreamsservice")
	}

	applicationCallback := func(c context.Context, app vocab.ActivityStreamsApplication) error {
		if pkProp := app.GetW3IDSecurityV1PublicKey(); pkProp != nil {
			for iter := pkProp.Begin(); iter != pkProp.End(); iter = iter.Next() {
				if iter.IsW3IDSecurityV1PublicKey() {
					pubkey = iter.Get()
					resolved = true
					return nil
				}
			}
		}
		return errors.New("error deriving publickey from activitystreamsapp")
	}

	pubkeyCallback := func(c context.Context, pk vocab.W3IDSecurityV1PublicKey) error {
		pubkey = pk
		resolved = true
		return nil
	}

	if e := ResolveIRI(context.Background(), publicKeyIRI, personCallback, serviceCallback, applicationCallback, pubkeyCallback); e != nil {
		err = e
	}

	if err != nil {
		err = errors.Wrap(err, "error resolving publickey from iri, actor may not be valid: "+publicKeyIRI)
	}

	if !resolved {
		err = errors.New("error resolving publickey from iri, actor may not be valid: " + publicKeyIRI)
	}

	return pubkey, err
}

// GetResolvedActorFromIRI will resolve an IRI string to a fully populated actor.
func GetResolvedActorFromIRI(personOrServiceIRI string) (apmodels.ActivityPubActor, error) {
	var err error
	var apActor apmodels.ActivityPubActor
	resolved := false
	personCallback := func(c context.Context, person vocab.ActivityStreamsPerson) error {
		apa, e := apmodels.MakeActorFromExernalAPEntity(person)
		if apa != nil {
			apActor = *apa
			resolved = true
		}
		return e
	}

	serviceCallback := func(c context.Context, service vocab.ActivityStreamsService) error {
		apa, e := apmodels.MakeActorFromExernalAPEntity(service)
		if apa != nil {
			apActor = *apa
			resolved = true
		}
		return e
	}

	applicationCallback := func(c context.Context, app vocab.ActivityStreamsApplication) error {
		apa, e := apmodels.MakeActorFromExernalAPEntity(app)
		if apa != nil {
			apActor = *apa
			resolved = true
		}
		return e
	}

	if e := ResolveIRI(context.Background(), personOrServiceIRI, personCallback, serviceCallback, applicationCallback); e != nil {
		err = e
	}

	if err != nil {
		err = errors.Wrap(err, "error resolving actor from property value")
	}

	if !resolved {
		err = errors.New("error resolving actor from property value")
	}

	return apActor, err
}
