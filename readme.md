# Find a Friend API

Este projeto é um exercício da trilha de Node.js da Rocketseat, com o objetivo de praticar os princípios do SOLID através da criação de uma API para adoção de animais.

## Descrição

A FindAFriend API permite o cadastro de pets e organizações (ONGs), além de possibilitar a busca e filtragem de pets disponíveis para adoção em diferentes cidades. O sistema foi desenvolvido seguindo os princípios do SOLID, garantindo um código mais modular, testável e de fácil manutenção.

## Requisitos Funcionais

- [x] Deve ser possível cadastrar um pet
- [x] Deve ser possível listar todos os pets disponíveis para adoção em uma cidade
- [x] Deve ser possível filtrar pets por suas características
- [x] Deve ser possível visualizar detalhes de um pet para adoção
- [x] Deve ser possível se cadastrar como uma ORG
- [x] Deve ser possível realizar login como uma ORG

## Regras de negócio

- [x] Para listar os pets, obrigatoriamente precisamos informar a cidade
- [x] Uma ORG precisa ter um endereço e um número de WhatsApp
- [x] Um pet deve estar ligado a uma ORG
- [x] O usuário que quer adotar, entrará em contato com a ORG via WhatsApp
- [x] Todos os filtros, além da cidade, são opcionais
- [x] Para uma ORG acessar a aplicação como admin, ela precisa estar logada.
