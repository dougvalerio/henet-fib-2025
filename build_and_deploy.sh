#!/bin/bash

# Construir a imagem Docker
docker build --pull --rm -f "Dockerfile" -t henet-fib-2025:latest "."

# Salvar a imagem Docker como um arquivo tar
docker save -o /home/darkowl/henet-fib-2025.tar henet-fib-2025

# Copiar o arquivo tar para o servidor remoto
scp /home/darkowl/henet-fib-2025.tar velejar@177.38.244.53:/home/velejar/