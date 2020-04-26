#!/bin/bash

gcloud scheduler jobs create http corona-compare-run-trigger \
    --schedule='30 00 * * *' \
    --uri=https://cloudbuild.googleapis.com/v1/projects/corona-compare/triggers/release-from-head:run \
    --message-body='{"branchName": "master"}' \
    --oauth-service-account-email=corona-compare@appspot.gserviceaccount.com \
    --oauth-token-scope=https://www.googleapis.com/auth/cloud-platform
