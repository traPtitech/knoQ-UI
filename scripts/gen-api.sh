#!/bin/bash -eu

tmp=$(mktemp)
trap "rm -f '$tmp'" EXIT

curl https://raw.githubusercontent.com/traPtitech/knoQ/develop/docs/swagger.yaml | yq e 'explode(.)' - > ${tmp}

npm exec -- openapi-generator-cli generate -g typescript-fetch -i ${tmp} -o src/api/generated
