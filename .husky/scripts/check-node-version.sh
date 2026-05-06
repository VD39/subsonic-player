#!/bin/bash
nvmrc=$(cat .nvmrc)

grep -q "NODE_VERSION=$nvmrc" Dockerfile || {
  echo "ERROR: Dockerfile NODE_VERSION does not match .nvmrc ($nvmrc)";
  exit 1;
}
