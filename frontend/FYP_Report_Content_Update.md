# FYP Report Content for SwapIt

> **Note**: As I cannot directly edit `.odt` (binary) files, I have generated the updated text content below. You can copy and paste this into your `FYPDoc.odt` file.

---

## ⦁ Table of Contents

New paragraphs formatted as Heading 1, Heading 2, and Heading 3 will be added to the table automatically. To update this table of contents in Microsoft Word, put the cursor anywhere in the table and press F9. If you want the table to be easy to maintain, do not change it manually.

Table of Contents	1
Definitions and Acronyms	4
List of Figures	5
List of Tables	7
1.	Introduction	8
1.1	Problem Statement	9
1.2	Objectives	9
1.3	Scope of the Project	9
1.4	Significance of the Project	10
1.5	Artificial Intelligence features	10
1.6	Project Deliverables	10
2.	Domain Analysis	11
2.1	Customer	11
2.2	Stakeholders	11
2.3	Affected Groups with social or economic impact	12
2.4	Dependencies/ External Systems	13
2.5	Related Projects with feature comparison	14
2.5.1	Related Projects	14
2.5.2	Feature Comparison	15
2.6	Context Diagram	16
2.7	Data Flow Diagram Level 0	17
3.	Requirements analysis	19
3.1	List of Actors	19
3.2	Product Backlog	19
3.2.1	User Authentication	22
3.2.2	Profile Management	23
3.2.3	Post Ad (Asset Deployment)	25
3.2.4	Marketplace Discovery	26
3.2.5	AI Valuation & Smart Match	27
3.2.6	Wishlist (Vault)	28
3.2.7	Bidding & Trading	29
3.2.8	Messaging	29
3.2.9	Admin Dashboard	30
3.2.10	Non-Functional Requirements	33
3.3	Figma UI/UX Designs	37
4.	Project Planning and Execution using Sprints	53
4.1	Jira	53
4.2	Slack	53
4.3	Github Repository	53
4.4	Sprint 1	53
4.4.1	Sprint 1 Planning Meeting Minutes	53
4.4.2	Sprint 1 Backlog	55
4.4.3	Sprint 1 Design Class Diagram	58
4.4.4	Sprint 1 Sequence Diagram	59
4.4.5	Sprint 1 Decision Table	60
4.4.6	Sprint 1 Extended Test Cases	61
4.4.7	Sprint 1 Review Meeting	62
4.4.8	Sprint 1 Retrospective Meeting	64
5.	System Architecture	66
5.1	System context Diagram	66
5.2	System Container Diagram	67
5.3	Component Diagram	68
5.4	Code Diagrams	69
5.5	ERD	70
5.6	Data Dictionary	72

---

## Definitions and Acronyms

| Acronym | Definition |
| :--- | :--- |
| **LTP** | Loyalty/Liquidity Token Points (In-app currency for value estimation) |
| **AI** | Artificial Intelligence |
| **LLM** | Large Language Model |
| **UI/UX** | User Interface / User Experience |
| **C2C** | Consumer to Consumer |
| **SPA** | Single Page Application |
| **MVP** | Minimum Viable Product |

---

## List of Figures/Tables
*(Space left empty for diagrams as requested)*

---

## 1. Introduction

### 1.1 Problem Statement
In the modern digital economy, direct barter (trading goods for goods) remains archaic and inefficient. Users struggle to find fair exchanges because value perception is subjective (e.g., "Is my bicycle worth your guitar?"). Existing platforms like OLX or eBay focus on cash transactions, leaving the barter community underserved. There is no reliable mechanism to:
1.  Accurately estimate the relative value of disparate items without cash.
2.  Efficiently match traders who have a "double coincidence of wants" (Person A has what Person B wants, and Person B has what Person A wants).

### 1.2 Objectives
The primary objective is to develop **SwapIt**, a premier AI-powered barter marketplace that facilitates seamless asset exchange.
*   To create a secure platform for posting and discovering tradeable items.
*   To integrate **AI Valuation** that automatically suggests a fair point value (LTP) for items based on image and description analysis.
*   To implement a **Smart Match** system that recommends trades based on user preferences and portfolio contents.
*   To provide a premium, modern user experience with real-time negotiation capabilities.

### 1.3 Scope of the Project
The project covers the development of a responsive web application using Next.js.
*   **Modules**: Authentication, Product Listing (Post Ad), Marketplace (Explore), User Dashboard (Portfolio), Chat System, and Wishlist.
*   **AI Integration**: A module to process item details and output a valuation score and potential match suitability.
*   **Exclusions**: Logistics/Shipping handling is out of scope for the MVP; trades are assumed to be finalized user-to-user.

### 1.4 Significance of the Project
SwapIt modernizes the age-old practice of bartering. By introducing AI-driven valuation, it removes the friction of "value uncertainty," encouraging a circular economy where unused assets are recirculated rather than discarded. It empowers users to upgrade their lifestyle ("Asset Ascension") without immediate cash liquidity.

### 1.5 Artificial Intelligence features
1.  **AI Valuation Meter**: Uses computer vision and market data to analyze item photos and descriptions, assigning a "Fair Price Meter" score and an estimated LTP value (e.g., "1200 LTP"). This standardizes value across the platform.
2.  **Smart Match AI**:  algorithms that analyze user behavior, "Want" lists, and "Have" lists to proactively alert users of high-probability trade opportunities (e.g., "We found 3 traders looking for your item").

### 1.6 Project Deliverables
*   Functional Web Application (Next.js/React).
*   Source Code Repository (GitHub).
*   Documentation (FYP Report).
*   AI Model Integration (Mocked/Prototype for MVP).

---

## 2. Domain Analysis

### 2.1 Customer
The primary customers are individual traders, hobbyists, collectors, and bargained-hunters who wish to exchange underutilized items for goods they actual need. Demographics range from tech-savvy millennials to budget-conscious families.

### 2.2 Stakeholders
*   **End Users (Traders)**: People listing and searching for items.
*   **Administrators**: Platform managers overseeing content moderation and user disputes.
*   **Developers**: The technical team building and maintaining the stack.

### 2.3 Affected Groups with social or economic impact
*   **Local Communities**: Promotes local sustainability by reusing goods.
*   **Retailers**: Indirect competition as users may prefer swapping over buying new.

### 2.4 Dependencies/ External Systems
*   **Auth Provider**: Custom local auth or OAuth (Google/Facebook).
*   **Database**: For storing user profiles and item catalog.
*   **AI Service API**: For processing valuations (e.g., OpenAI API or custom Tensor model).
*   **Hosting**: Cloud platform (Vercel/AWS).

### 2.5 Related Projects with feature comparison
#### 2.5.1 Related Projects
*   **OLX/Craiglist**: Classifieds, but cash-focused and high fraud risk.
*   **eBay**: Auction-based, fees are high, primarily cash.
*   **Facebook Marketplace**: Unstructured, relies heavily on manual negotiation details.

#### 2.5.2 Feature Comparison
| Feature | SwapIt | OLX | eBay |
| :--- | :---: | :---: | :---: |
| **Primary Mode** | Barter / Swap | Cash | Cash / Auction |
| **AI Valuation** | Yes (Points) | No | No |
| **Smart Matching** | Yes | No | No |
| **Trust Score** | Yes (Node Verification) | Basic Ratings | Seller Ratings |

### 2.6 Context Diagram
*(Leave space for Diagram)*

### 2.7 Data Flow Diagram Level 0
*(Leave space for Diagram)*

---

## 3. Requirements Analysis

### 3.1 List of Actors
1.  **Visitor**: User who has not logged in. Can browse but not trade.
2.  **Member (Authenticated User)**: Can post ads, bid, chat, and access the portfolio.
3.  **Admin**: Can manage users, remove illegal listings, and view platform analytics.

### 3.2 Product Backlog
The backlog focuses on delivering the core "Swap" loop.

#### 3.2.1 User Authentication
*   **Real Authentication System**: Implement JWT-based authentication.
*   **Role-Based Access**: Distinguish between general 'Users' and 'Admins'.
*   **Email Verification**: Security step required before trading.

#### 3.2.2 Profile Management
*   View public profile (Trust Score, Active Ads).
*   Edit profile details.
*   Settings (Notifications, Privacy).

#### 3.2.3 Post Ad (Asset Deployment)
*   **Image Gallery & Upload System**: Real backend file upload integration (e.g. Cloudinary) instead of mocks.
*   **Structured Data Entry**: Enter Details, Usage History, and Known Defects.
*   **AI Check**: "Run AI Evaluation" to get a recommended price point.
*   Publish listing to Marketplace.

#### 3.2.4 Marketplace Discovery
*   **Search Optimization**: Backend-driven keyword search, geo-location filters, category filters, and sorting parameters (latest, relevance).
*   View Product Details (Gallery, Description, Fair Price Meter).

#### 3.2.5 AI Valuation & Smart Match
*   **AI Valuation API**: Connects to backend service to estimate LTP value.
*   **Smart Match Algorithm**: Rule-based matching creating alerts for reciprocal needs.
*   System analyzes listing quality.

#### 3.2.6 Wishlist (Vault)
*   Save interesting items.
*   Remove items.
*   "Add to Cart" (Initiate Trade) from wishlist.

#### 3.2.7 Bidding & Trading Escrow
*   **Offer Negotiation System**: Users can submit counter-offers, multi-item offers, combined point/item offers, with expiration tracking.
*   **Trade Lifecycle Management**: Backend enforcement of state transitions (Pending -> Accepted -> In Progress -> Completed -> Disputed).
*   Mark trade as completed.

#### 3.2.8 Messaging
*   Real-time chat between buyer and seller.
*   Negotiation history.

#### 3.2.9 Admin Dashboard & Dispute Resolution
*   **Admin Dispute Handling**: Admins can review trades holding a 'Disputed' status using chat evidence.
*   View all users and fraud detection flags.
*   View verified items.

#### 3.2.10 Trust & Reputation System
*   **Review & Rating System**: Users rate each other (1-5 stars) entirely dependent on completed trades.
*   Trust score calculation algorithm updated in backend.

#### 3.2.11 Notification System
*   Real-time and database alerts for: New Message, Offer Received, Offer Updated, and Smart Matches.

#### 3.2.12 Non-Functional Requirements
*   **Performance**: Pages load < 2 seconds.
*   **Reliability**: 99.9% uptime.
*   **Scalability**: Architecture supports growing user base.
*   **Security**: Data encryption for passwords; visible Trust Scores.

### 3.3 Figma UI/UX Designs
*(Leave space for Figma Screenshots)*

---

## 4. Project Planning and Execution using Sprints

### 4.1 Jira
Used for issue tracking and backlog management. Epics were broken down into user stories.

### 4.2 Slack
Used for team communication and daily standups.

### 4.3 Github Repository
**URL:** [https://github.com/abdu11ah78/swapit](https://github.com/abdu11ah78/swapit)
Used for version control. Branching strategy: `main` for production, `feature/*` for new modules.

### 4.4 Sprint 1
**Goal**: Core Foundation & UI Framework.
**Duration**: 2 Weeks.

#### 4.4.1 Sprint 1 Planning Meeting Minutes
*   Decided on Next.js + Tailwind CSS stack.
*   Defined the visual theme (Modern, "Outfit" font).
*   Prioritized Authentication and Home Page structure.

#### 4.4.2 Sprint 1 Backlog
1.  Setup Project Repo.
2.  Design Landing Page.
3.  Implement Global Layout (Header/Footer).
4.  Implement Login/Signup Pages.

#### 4.4.3 Sprint 1 Design Class Diagram
*(Leave space for Diagram)*

#### 4.4.4 Sprint 1 Sequence Diagram
*(Leave space for Diagram)*

#### 4.4.5 Sprint 1 Decision Table
*(Leave space for Table)*

#### 4.4.6 Sprint 1 Extended Test Cases
*(Leave space for Table)*

#### 4.4.7 Sprint 1 Review Meeting
*   Demonstrated the responsive Landing Page.
*   Verified Login flow.
*   Feedback: Navbar needs simplification (Done in later phases).

#### 4.4.8 Sprint 1 Retrospective Meeting
*   **Good**: rapid UI development with Tailwind.
*   **Bad**: Initial confusion on "Protocol" vs "Marketplace" terminology.
*   **Action**: Refine dictionary in next sprint.

---

## 5. System Architecture

### 5.1 System context Diagram
*(Leave space for Diagram)*

### 5.2 System Container Diagram
*(Leave space for Diagram)*

### 5.3 Component Diagram
*(Leave space for Diagram)*

### 5.4 Code Diagrams
*(Leave space for Diagram)*

### 5.5 ERD
*(Leave space for Diagram showing Users <-> Items <-> Trades)*

### 5.6 Data Dictionary
*   **User**: `id`, `name`, `email`, `password_hash`, `trust_score`.
*   **Item**: `id`, `owner_id`, `title`, `description`, `ltp_value`, `images[]`.
*   **Trade**: `id`, `buyer_id`, `seller_id`, `item_id`, `status`.

