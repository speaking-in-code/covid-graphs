#!/bin/bash

curl https://covidtracking.com/api/states/daily.json \
  -o src/assets/daily.json
