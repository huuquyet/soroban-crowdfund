#!/bin/bash

set -e

NETWORK=$1

SOROBAN_RPC_HOST=$2

if [[ -d "./.soroban/contracts" ]]; then
  echo "Found existing '.soroban/contracts' directory; already initialized."
  exit 0
fi

if type soroban >/dev/null; then
  echo "Using soroban cli"
else
  echo "Soroban cli not found; installing soroban cli"
  cargo install --locked soroban-cli --debug --features opt --version 21.0.0-rc.1
fi

if [[ $SOROBAN_RPC_HOST != "" ]]; then
  SOROBAN_RPC_URL=$SOROBAN_RPC_HOST
elif [[ $NETWORK == "futurenet" ]]; then
  SOROBAN_RPC_URL="https://rpc-futurenet.stellar.org"
elif [[ $NETWORK == "testnet" ]]; then
  SOROBAN_RPC_URL="https://soroban-testnet.stellar.org"
else
  # assumes standalone on quickstart, which has the soroban/rpc path
  SOROBAN_RPC_URL="http://localhost:8000/soroban/rpc"
fi

case $NETWORK in
futurenet)
  echo "Using Futurenet network with RPC URL: $SOROBAN_RPC_URL"
  SOROBAN_NETWORK_PASSPHRASE="Test SDF Future Network ; October 2022"
  ;;
testnet)
  echo "Using Testnet network with RPC URL: $SOROBAN_RPC_URL"
  SOROBAN_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
  ;;
standalone)
  echo "Using standalone network with RPC URL: $SOROBAN_RPC_URL"
  SOROBAN_NETWORK_PASSPHRASE="Standalone Network ; February 2017"
  ;;
*)
  echo "Usage: $0 standalone|futurenet|testnet [rpc-host]"
  exit 1
  ;;
esac

echo "Add the $NETWORK network to cli client"
soroban network add --global \
  --rpc-url $SOROBAN_RPC_URL \
  --network-passphrase "$SOROBAN_NETWORK_PASSPHRASE" $NETWORK

echo "Add $NETWORK network to shared config"
echo "{ \"network\": \"$NETWORK\", \"rpcUrl\": \"$SOROBAN_RPC_URL\", \"networkPassphrase\": \"$SOROBAN_NETWORK_PASSPHRASE\" }" >./src/shared/config.json

if !(soroban keys ls | grep token-admin 2>&1 >/dev/null); then
  echo "Create the token-admin identity"
  soroban keys generate --global token-admin --network $NETWORK
fi

# This will fail if the account already exists, but it'll still be fine.
echo "Fund token-admin account from friendbot"
soroban keys fund --global token-admin --network $NETWORK

ARGS="--network $NETWORK --source token-admin"

WASM_PATH="./target/wasm32-unknown-unknown/release/"
TOKEN_PATH=$WASM_PATH"soroban_token_contract"
CROWDFUND_PATH=$WASM_PATH"soroban_crowdfund_contract"

echo "Build contracts"
soroban contract build
echo "Optimizing contracts"
soroban contract optimize --wasm $TOKEN_PATH".wasm"
soroban contract optimize --wasm $CROWDFUND_PATH".wasm"

echo "Deploy the abundance token contract"
ABUNDANCE_ID="$(
  soroban contract deploy $ARGS \
    --wasm $TOKEN_PATH".optimized.wasm"
)"
echo "Contract deployed succesfully with ID: $ABUNDANCE_ID"

echo "Deploy the crowdfund contract"
CROWDFUND_ID="$(
  soroban contract deploy $ARGS \
    --wasm $CROWDFUND_PATH".optimized.wasm"
)"
echo "Contract deployed succesfully with ID: $CROWDFUND_ID"

echo "Initialize the abundance token contract"
soroban contract invoke \
  $ARGS \
  --id $ABUNDANCE_ID \
  -- \
  initialize \
  --symbol ABND \
  --decimal 7 \
  --name abundance \
  --admin token-admin

echo "Initialize the crowdfund contract"
deadline="$(($(date +"%s") + 86400))"
soroban contract invoke \
  $ARGS \
  --id $CROWDFUND_ID \
  -- \
  initialize \
  --recipient token-admin \
  --deadline $deadline \
  --target_amount "3000000000" \
  --token $ABUNDANCE_ID

echo "Generate bindings contracts"
soroban contract bindings typescript \
  --network $NETWORK \
  --id $ABUNDANCE_ID \
  --wasm $TOKEN_PATH".optimized.wasm" \
  --output-dir ./.soroban/contracts/token \
  --overwrite || true
soroban contract bindings typescript \
  --network $NETWORK \
  --id $CROWDFUND_ID \
  --wasm $CROWDFUND_PATH".optimized.wasm" \
  --output-dir ./.soroban/contracts/crowdfund \
  --overwrite || true

echo "Done"
