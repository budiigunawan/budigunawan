---
title: Magpie
summary: A unified omnichannel system that lets Paragon's distribution companies manage e-commerce orders and products across 35 stores in Indonesia and Malaysia.
kind: professional
workEntry: paragon-corp
date: '2023-09-01'
stack:
  - React
  - JavaScript
  - React Query
  - Zustand
  - Cypress
  - Jest
tags:
  - e-commerce
  - omnichannel
  - order management
  - internal tools
featured: true
built:
  - A unified omnichannel system for Parama and Pharmacore, Paragon's distribution companies in Indonesia and Malaysia.
  - A product management module that integrates product data from 35 stores across 4 marketplaces.
  - An end-to-end test suite with Cypress covering the key user scenarios.
impact:
  - Fulfilled over 100,000 orders from more than 35 Paragon stores across Indonesia and Malaysia through one system.
  - Cut order processing time by 30%.
  - Improved product management efficiency across 35 stores in 4 marketplaces.
  - Raised end-to-end test coverage from 0% to 78%.
---

Magpie is internal software for Paragon's distribution companies, so what I can publish here is limited to what is already public. The interesting problem was the shape of the work rather than any one screen: products and orders arrive from 35 stores and 4 marketplaces, and the system has to present them as a single operation instead of a pile of separate channels.

That is also why the test suite mattered. When several storefronts feed one system, a regression in one path is easy to miss by hand, so the Cypress suite grew to cover the flows the system supports.
