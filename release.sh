#!/bin/bash

set -e

ng build --prod --base-href=/ --aot --build-optimizer --prod
firebase deploy --only hosting --project corona-compare
