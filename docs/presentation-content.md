# Travora presentation content

English presentation organized into eight slides. Supervisor and team names come from the graduation project form. Team order and roles follow the user's instructions. Abstract and Introduction appear on separate slides. The presentation focuses on the project concept and proposed solution, with no implementation progress section.

## 1. Project title

**Travora: Smart Tourism and Personalized Trip Planning Platform**

Graduation Project

## 2. Supervisors

- **Dr. Lamia Hassaan**: Project Supervisor
- **Eng. Mohamed Hassan**: Supporting Academic Staff

## 3. Team members and roles

| Team member | Role |
|---|---|
| Yousef Mohamed El Sayed Fares | Backend |
| Haneen Mohamed Ahmed Atta Mohamed | Frontend |
| Wesam Khaled Farouk Ahmed | Flutter |
| Mostafa Emad Hendawy | AI |
| Youssef Mohamed Shahhat Salem Awad | AI |

## 4. Abstract

Travora proposes a smart tourism experience through a web platform and a Flutter mobile application. It aims to create itineraries around a traveler's interests, budget, and available time, while connecting the itinerary to local travel services. The project scope includes traveler, provider, driver, and administration workspaces, bringing itineraries, bookings, budgets, and trip documents together.

## 5. Introduction

Planning a trip requires coordinating places to visit, accommodation, local transport, and spending within a limited schedule. Travora focuses initially on Egyptian destinations. The project will provide a web platform and a Flutter mobile app connected to the same backend services, allowing travelers to plan before departure and access their trip details during travel.

## 6. Problem definition

The project addresses four planning and coordination problems:

- **Fragmented information:** travelers need to combine accommodation, activity, and transport details into a workable itinerary.
- **Limited personalization:** a plan must reflect each traveler's interests, budget, and available time.
- **Changing conditions:** delays, weather, and service availability can disrupt a fixed schedule.
- **Service coordination:** bookings and deliveries require consistent information between travelers, providers, and drivers.

## 7. Solution approach

The proposed workflow is:

1. Develop a React web platform and a Flutter mobile application using shared backend APIs.
2. Collect the destination, dates, budget, and interests to generate a personalized daily itinerary.
3. Connect the itinerary to accommodation, activities, restaurant reservations, guides, transport, and food delivery.
4. Track trip expenses, bookings, and documents in the traveler workspace.
5. Use provider, driver, and administration portals to coordinate services.
6. Adapt the itinerary when travel conditions change.

The traveler, provider, driver, and administration workspaces will coordinate planning and travel services. This workflow describes the proposed solution.

## 8. Tools

| Area | Tools | Purpose |
|---|---|---|
| UI/UX | Figma | Interface design and prototypes |
| Frontend | React, Vite, React Router | Web interface and navigation |
| Mobile development | Flutter, Dart | Mobile application connected to the shared backend APIs |
| Styling | Tailwind CSS | Responsive layouts and visual styling |
| Backend | Node.js, Express.js | HTTP APIs and application logic |
| Database | PostgreSQL, node-postgres (`pg`) | Relational data and database access |
| Authentication | Argon2id, PostgreSQL sessions, HTTP cookies | Password hashing and revocable sessions |
| Testing and code checks | `node:test`, ESLint | Backend tests and frontend linting |
| Version control | Git | Tracking source-code changes |

The technology choices include the Flutter mobile app requested by the user. No specific AI framework is listed because the team has not confirmed one.

## Source notes

This draft is based on the project's confirmed design and implementation, without external statistics or claimed user-research findings.

- Project scope and implementation: [PROJECT_CONTEXT.md](/Users/yousiffares/Desktop/smart-tourism-platform/PROJECT_CONTEXT.md).
- Supervisor and team names: [Graduation project form](/Users/yousiffares/Downloads/Graduation_Project_Form_Updated_Travora.pdf). Names are English only. The user confirmed the displayed team order and individual role assignments.
- Planned Flutter application: confirmed by the user; no Flutter implementation is claimed in the current project.
- Backend packages: [package.json](/Users/yousiffares/Desktop/smart-tourism-platform/backend/package.json).
- Frontend packages: [package.json](/Users/yousiffares/Desktop/smart-tourism-platform/frontend/package.json).
- Figma reference: [Travora design](https://www.figma.com/design/WGfzRMh2fq0LkJy5fXgtRq/?node-id=223-332).
