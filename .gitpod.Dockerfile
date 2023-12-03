# Based on Preview 7
# https://soroban.stellar.org/docs/reference/releases

# You can find the new timestamped tags here: https://hub.docker.com/r/gitpod/workspace-full/tags
FROM gitpod/workspace-full:2023-11-24-15-04-57

RUN apt update && apt install -y curl

RUN mkdir -p ~/.local/bin

RUN curl -L https://github.com/stellar/soroban-tools/releases/download/v20.0.0-rc.4.1/soroban-cli-20.0.0-rc.4.1-x86_64-unknown-linux-gnu.tar.gz | tar xz -C ~/.local/bin soroban
RUN chmod +x ~/.local/bin/soroban
RUN echo "source <(soroban completion --shell bash)" >> ~/.bashrc

RUN rustup self uninstall -y
RUN rm -rf .rustup
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain none -y

RUN rustup install 1.74
RUN rustup target add --toolchain 1.74 wasm32-unknown-unknown
RUN rustup component add --toolchain 1.74 rust-src
RUN rustup default 1.74

RUN sudo apt-get update && sudo apt-get install -y binaryen

# Enable sparse registry support, which will cause cargo to download only what
# it needs from crates.io, rather than the entire registry.
ENV CARGO_REGISTRIES_CRATES_IO_PROTOCOL=sparse
