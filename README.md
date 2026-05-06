# SwapIt - Premium Barter & Asset Exchange Marketplace

SwapIt is a next-generation lifestyle upgrade platform designed to facilitate secure, high-value asset exchanges without the use of currency. By leveraging AI-driven valuation and a robust escrow-protected trade lifecycle, SwapIt provides a decentralized and trustless environment for global bartering.

---

##  System Architecture & Key Features

### 1. AI-Driven Asset Intelligence
*   **Automated Valuation (LTP)**: Integrated "Evaluate" engine that utilizes vision and language models to assign **Lifestyle Trade Points (LTP)** to assets based on condition, market demand, and technical specs.
*   **Intelligent Matchmaking**: A smart recommendation system that pairs traders based on mutual asset compatibility and desired exchange categories.

### 2. Secure Trade & Escrow Protocol
*   **Multi-Step Lifecycle**: A governed trade process that manages transitions from "Pending" to "In-Escrow" and finally "Completed."
*   **Escrow Security**: Built-in asset protection that ensures both parties fulfill their contractual obligations before the trade is finalized.
*   **Audit Trail (TradeEvents)**: Every state change in a transaction is permanently recorded for transparency and security auditing.

### 3. Advanced Negotiation Engine
*   **Complex Swap Support**: Support for 1-for-1, 1-for-many, and many-for-many asset exchanges.
*   **LTP Balancing**: Allows users to balance trades using Lifestyle Trade Points if assets have unequal market values.
*   **Recursive Counter-Offers**: A nested negotiation system allowing traders to refine terms, add/remove items, or adjust point balances indefinitely.

### 4. Dynamic Taxonomy & Governance
*   **Meta-Data Schema**: A flexible system allowing for "Smart Attributes" (e.g., RAM for laptops, Mileage for cars) that render dynamically across the platform.
*   **Community-Driven Growth**: A moderated "Suggestion Loop" where the community can propose marketplace expansions for admin approval.
*   **Administrative Command Center**: A full-scale dashboard for governing users, categories, disputes, and regional operational status.

### 5. Reputation & Trust Ecosystem
*   **Participant Scoring**: A trust-based system that calculates credibility based on successful trades and user feedback.
*   **Peer-to-Peer Reviews**: Post-trade review system that captures detailed qualitative and quantitative feedback.
*   **Dispute Resolution Module**: An integrated support system allowing users to flag trades for administrative review and resolution.

### 6. Real-Time Communication Hub
*   **Negotiation Messaging**: Integrated chat system specifically designed for asset discussion and image sharing.
*   **System Notifications**: Real-time alerts for offer receipts, trade status updates, and security warnings.

---

## 🛠️ Technology Stack

### Backend
*   **Core**: .NET 8 Web API
*   **Patterns**: CQRS (MediatR), Repository-free Clean Architecture
*   **Persistence**: SQL Server with EF Core (Migration-based evolution)
*   **Security**: JWT-based Authentication with Identity Framework

### Frontend
*   **Core**: Next.js 14 (App Router)
*   **Logic**: TanStack Query (Real-time data synchronization)
*   **UI**: Framer Motion, Lucide Icons, and a custom design system focusing on glassmorphism and premium aesthetics.

---

## 📂 Repository Structure

```text
SwapIt/
├── backend/                # Microservice-ready .NET Core API
│   ├── src/Core/           # Domain Entities & Business Logic
│   ├── src/Application/    # Use Case Handlers (Commands/Queries)
│   ├── src/Infrastructure/ # Persistence, Identity & External Services
│   └── src/API/            # Controllers & Middleware
└── frontend/               # Next.js Application
    ├── src/app/            # High-performance App Routing
    ├── src/features/       # Modular Business Logic Hooks
    └── src/components/     # Design System Components
```

---

## ⚙️ Setup & Deployment

### Backend
1. Configure connection string in `appsettings.json`.
2. Apply schema: `dotnet ef database update --project src/Infrastructure --startup-project src/API`.
3. Launch: `dotnet run --project src/API`.

### Frontend
1. Install: `npm install`.
2. Launch: `npm run dev`.

---

## 📈 Project Status
**Phase 3: Taxonomy & Infrastructure Complete.**  
Currently transitioning to **Phase 4: AI Model Integration and Global Verification.**
