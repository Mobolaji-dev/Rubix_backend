# Rubix Documentation

Welcome to the public documentation for Rubix — the Repository Decomposition Advisor.

Rubix helps engineering teams understand how to split monolithic codebases into safer, more maintainable microservice boundaries. It combines repository-level reasoning, dependency analysis, and service extraction guidance to turn architectural refactoring from guesswork into a measurable, reviewable process.

## What Rubix does

Rubix analyzes a GitHub repository and identifies:

- likely bounded contexts and domain groupings
- cross-module dependency patterns
- shared data ownership risks
- likely microservice extraction candidates
- recommended refactoring order with risk scoring

## Why it matters

Modern monoliths are difficult to decompose because they often hide coupling in:

- shared database tables
- cross-module function calls
- implicit ownership conflicts
- unclear domain boundaries

Rubix reduces this risk by combining static analysis, whole-repository reasoning, and a coupling audit pipeline.

## Main documentation sections

- [Overview](overview.md)
- [Architecture](architecture.md)
- [Data ownership model](data-ownership-model.md)
- [API reference](api-reference.md)
- [IBM Bob IDE guide](bob-ide-guide.md)
- [Hackathon judge checklist](hackathon-judge-checklist.md)

## Live links

- App: https://rubix.pxxl.click/
- Landing page: https://rubix-landing.pxxl.click
- Backend API docs: https://rubixbackend.pxxl.click/docs
- GitHub repo: https://github.com/techbyFEMI/Rubix_backend.git

## Documentation status

This documentation set is written to be deployable on GitHub Pages using a static site generator structure. The content retains the original project information while removing GitBook-specific syntax and making it suitable for a standard Markdown documentation site.
