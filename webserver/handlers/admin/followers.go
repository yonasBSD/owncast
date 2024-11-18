package admin

import (
	"encoding/json"
	"net/http"

	"github.com/owncast/owncast/activitypub/persistence"
	"github.com/owncast/owncast/activitypub/requests"
	"github.com/owncast/owncast/persistence/configrepository"
	"github.com/owncast/owncast/webserver/handlers/generated"
	webutils "github.com/owncast/owncast/webserver/utils"
)

// ApproveFollower will approve a federated follow request.
func ApproveFollower(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	// type approveFollowerRequest struct {
	// 	ActorIRI string `json:"actorIRI"`
	// 	Approved bool   `json:"approved"`
	// }

	decoder := json.NewDecoder(r.Body)
	var approval generated.ApproveFollowerJSONBody
	if err := decoder.Decode(&approval); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to handle follower state with provided values")
		return
	}

	if *approval.Approved {
		// Approve a follower
		if err := persistence.ApprovePreviousFollowRequest(*approval.ActorIRI); err != nil {
			webutils.WriteSimpleResponse(w, false, err.Error())
			return
		}

		configRepository := configrepository.Get()
		localAccountName := configRepository.GetDefaultFederationUsername()

		followRequest, err := persistence.GetFollower(*approval.ActorIRI)
		if err != nil {
			webutils.WriteSimpleResponse(w, false, err.Error())
			return
		}

		// Send the approval to the follow requestor.
		if err := requests.SendFollowAccept(followRequest.Inbox, followRequest.RequestObject, localAccountName); err != nil {
			webutils.WriteSimpleResponse(w, false, err.Error())
			return
		}
	} else {
		// Remove/block a follower
		if err := persistence.BlockOrRejectFollower(*approval.ActorIRI); err != nil {
			webutils.WriteSimpleResponse(w, false, err.Error())
			return
		}
	}

	webutils.WriteSimpleResponse(w, true, "follower updated")
}

// GetPendingFollowRequests will return a list of pending follow requests.
func GetPendingFollowRequests(w http.ResponseWriter, r *http.Request) {
	requests, err := persistence.GetPendingFollowRequests()
	if err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteResponse(w, requests)
}

// GetBlockedAndRejectedFollowers will return blocked and rejected followers.
func GetBlockedAndRejectedFollowers(w http.ResponseWriter, r *http.Request) {
	rejections, err := persistence.GetBlockedAndRejectedFollowers()
	if err != nil {
		webutils.WriteSimpleResponse(w, false, err.Error())
		return
	}

	webutils.WriteResponse(w, rejections)
}
