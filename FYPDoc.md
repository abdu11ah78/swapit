# FYP Report Content for SwapIt

> **Note**: This document contains a detailed, comprehensive expansion of Chapters 1 through 5 for your Final Year Project report. Copy this content into your `FYPDoc.odt` file.

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
| **JWT** | JSON Web Token (Used for secure authentication) |
| **ORM** | Object-Relational Mapping (Prisma) |

---

## List of Figures/Tables
*(Space left empty for diagrams as requested)*

---

## 1. Introduction

### 1.1 Problem Statement
In the contemporary digital economy, the concept of direct barter—trading goods for goods without the medium of hard currency—remains largely archaic and operationally inefficient. While platforms like OLX, eBay, and Facebook Marketplace have revolutionized peer-to-peer commerce, they primarily facilitate cash-based transactions. Users who wish to exchange underutilized assets (e.g., trading a guitar for a bicycle) face significant friction. 

The core problems are threefold:
1.  **Subjectivity of Value**: Unlike cash prices, the value of a used item in a trade is highly subjective. A user has no reliable, standardized metric to determine if "Item A" is a fair exchange for "Item B."
2.  **Double Coincidence of Wants**: The classic economic problem of barter—finding someone who not only has what you want but also wants what you have—is difficult to solve manually. Browsing endless listings to find a perfect mutual match is time-consuming and often futile.
3.  **Lack of Specialized Trust Mechanisms**: Existing platforms lack specific workflows for barter, such as structured negotiation loops where goods, rather than money, are the primary tender. This leads to a "trust deficit" where users are hesitant to ship or hand over items without immediate cash payment.

### 1.2 Objectives
The primary objective of this project is to design, develop, and deploy **SwapIt**, a state-of-the-art C2C (Consumer-to-Consumer) marketplace specifically engineered to facilitate seamless asset exchange. The project aims to achieve the following:

*   **Establish a Secure Trading Environment**: To create a robust web application where users can list, discover, and trade items with confidence, backed by verifiable user profiles.
*   **Integrate AI-Driven Valuation**: To implement an Artificial Intelligence module that analyzes item images and descriptions to suggest a standardized "Loyalty Token Point" (LTP) value. This serves as a common denominator for value, bridging the gap between disparate items.
*   **Develop a Smart Matching Algorithm**: To build a "Smart Match" system that proactively identifies and recommends trade opportunities based on a user's "Have" list and "Want" list, solving the double coincidence of wants.
*   **Modernize the Negotiation Experience**: To provide a premium user interface that supports real-time negotiation, allowing users to counter-offer with combinations of items and points, mirroring complex real-world barter dynamics.

### 1.3 Scope of the Project
The scope of **SwapIt** encompasses the end-to-end development of a responsive, single-page web application (SPA) built using the Next.js framework.

*   **Functional Modules**:
    *   **Authentication & Security**: Secure sign-up/login flows, session management, and password encryption.
    *   **Asset Deployment (Post Ad)**: A rich creation suite for listing items with multi-image uploads and detailed attribute tagging.
    *   **Marketplace Discovery**: An advanced search and filtering engine allowing users to browse by category, location, and condition.
    *   **User Dashboard (Portfolio)**: A central hub for users to manage their inventory, view incoming offers, and track trade history.
    *   **Intelligent Features**: Integration of AI services to provide estimated valuations and finding similar items.
    *   **Communication**: A real-time messaging system for buyers and sellers to discuss trade details.

*   **Exclusions**:
    *   **Physical Logistics**: The platform facilitates the *agreement* of the trade but does not handle the physical shipping or warehousing of goods in this MVP phase.
    *   **Financial Payment Processing**: The current scope focuses on barter and point-based trading; fiat currency payment gateways are reserved for future phases.

### 1.4 Significance of the Project
**SwapIt** represents a significant step forward in the "Circular Economy." By removing the friction associated with value uncertainty and finding trade partners, the platform encourages the reuse and recirculation of goods that would otherwise sit idle or be discarded. 

Socially, it empowers users to achieve "Asset Ascension"—upgrading their lifestyle by leveraging the latent value of their existing possessions rather than relying solely on liquidity. Technically, it demonstrates the practical application of AI in subjective valuation tasks, moving beyond simple classification to complex value estimation in a marketplace context.

### 1.5 Artificial Intelligence features
The application leverages AI to solve the inherent inefficiencies of barter:

1.  **AI Valuation Meter (Fair Price Engine)**: This feature utilizes computer vision and natural language processing to analyze an item's photo quality, brand, and usage description. It compares these factors against a database of similar items to generate a "Fair Price Meter" score and a suggested LTP value (e.g., "Estimated Value: 1200 LTP"). This gives traders a neutral "anchor price" to begin negotiations.
2.  **Smart Match & Recommendation AI**: This background algorithm continuously scans the database to find reciprocal matches. If User A lists a laptop and wants a camera, and User B lists a camera and wants a laptop, the system identifies this "perfect match" and alerts both parties, significantly increasing trade liquidity.

### 1.6 Project Deliverables
*   **Functional Web Application**: A fully deployed Next.js/React application accessible via web browser.
*   **Source Code Repository**: A complete, version-controlled codebase hosted on GitHub, following clean code practices.
*   **Documentation Suite**: A comprehensive FYP report detailing the development lifecycle, from requirements to testing.
*   **AI Prototype**: A functional integration of valuation logic, demonstrating the system's intelligent capabilities.

---

## 2. Domain Analysis

### 2.1 Customer
The target customer base for SwapIt is diverse, spanning several psychographic segments:
*   **The Hobbyist/Collector**: Individuals who trade specific items like video games, vinyl records, or sneakers. They understand value deeply but struggle to find specific trade partners.
*   **The Frugal Upgrader**: Students or young professionals who wish to upgrade their tech (e.g., phones, laptops) by trading in their older models plus a small top-up, rather than buying new at full price.
*   **The Minimalist**: Users looking to declutter their homes by exchanging unused goods for "consumable" value (points) or distinct items they actually need.
*   **Demographics**: Primarily tech-savvy Millennials and Gen Z (ages 18-35) who are comfortable with digital marketplaces and value sustainability.

### 2.2 Stakeholders
*   **End Users (Traders)**: The primary actors who list items, search for goods, and execute trades. Their main interest is usability, trust, and successful exchange rates.
*   **Platform Administrators**: The operational team responsible for content moderation (removing illegal/inappropriate listings), resolving user disputes, and ensuring platform health.
*   **Development Team**: The engineers and designers responsible for building, maintaining, and scaling the technical infrastructure.
*   **University Supervisors**: The academic stakeholders overseeing the project's adherence to engineering standards and educational goals.

### 2.3 Affected Groups with social or economic impact
*   **Local Communities**: SwapIt strengthens local community bonds by facilitating face-to-face exchanges and keeping value within the local ecosystem. It promotes a culture of sharing over consuming.
*   **Retailers & Manufacturers**: There is a minor market impact on traditional retailers, as an efficient secondary market can reduce the demand for brand-new goods. However, it also creates a resale value proposition that can encourage initial purchases.
*   **Environmental Advocates**: The platform directly supports environmental goals by extending the lifecycle of manufactured goods, reducing landfill waste and the carbon footprint associated with manufacturing new products.

### 2.4 Dependencies/ External Systems
*   **Authentication Provider**: The system relies on secure authentication mechanisms (custom implementation or services like NextAuth) to manage identity and session security.
*   **Cloud Hosting Infrastructure**: The application depends on cloud providers (e.g., Vercel, AWS, or Azure) for hosting the frontend application, API routes, and static assets (images).
*   **Database Service**: A persistent, relational database (e.g., PostgreSQL or MySQL) is critical for storing user profiles, item metadata, and transaction logs.
*   **AI Service APIs**: The valuation features utilize external AI endpoints (such as OpenAI's API or custom TensorFlow models) to process text and images for valuation.

### 2.5 Related Projects with feature comparison

#### 2.5.1 Related Projects
*   **OLX / Craigslist**: These are the giants of the classifieds world. They offer massive reach but are fundamentally "bulletin boards." They lack structured transaction flows, relying entirely on users to negotiate off-platform. Fraud risk is high, and they are overwhelmingly focused on cash sales.
*   **eBay**: A sophisticated auction and retail platform. While secure, fees are high (10-15%), and the focus is firmly on professional sellers and cash transactions. Bartering is not a supported use case.
*   **Facebook Marketplace**: Leverages social identity for trust but suffers from poor search granularity and zero support for non-cash trading. It is essentially an unstructured classifieds section within a social network.

#### 2.5.2 Feature Comparison
| Feature | SwapIt (Proposed) | OLX | eBay | Facebook Marketplace |
| :--- | :---: | :---: | :---: | :---: |
| **Primary Transaction Model** | Barter / Hybrid (Item + Points) | Cash | Cash / Auction | Cash |
| **AI Valuation Support** | **Yes (Fair Price Meter)** | No | No | No |
| **Smart Match Alerts** | **Yes (Reciprocal Matching)** | No | No | No |
| **Trust/Reputation System** | Comprehensive Node Verification | Basic Ratings | Seller Ratings | Social Profile Link |
| **Search Granularity** | High (Structured Attributes) | Medium | High | Low |
| **User Experience** | Modern, Premium UI | Functional/Dated | Complex | Casual |

### 2.6 Context Diagram
*(Leave space for Diagram)*
*To be inserted: A high-level diagram showing the User and Admin interacting with the SwapIt System, enabling data flow such as "Item Details" in and "Valuation/Match" out.*

### 2.7 Data Flow Diagram Level 0
*(Leave space for Diagram)*
*To be inserted: A DFD showing the core processes: Authentication -> Manage Profile -> Deploy Asset -> Search Marketplace -> Execute Trade -> Update Inventory.*

---

## 3. Requirements Analysis

### 3.1 List of Actors
1.  **Visitor (Guest)**: An unauthenticated user. They can browse the public marketplace and view listing details but cannot initiate trades, post items, or view seller contact info.
2.  **Member (Authenticated User)**: A registered user with a verified account. They have full access to posting ads, managing their wishlist, bidding on items, and chatting with other members.
3.  **Administrator**: A super-user with elevated privileges. Accesses a dedicated dashboard to view platform analytics (user growth, trade volume), ban malicious users, and delete non-compliant listings.

### 3.2 Product Backlog
The product backlog is organized by functional modules, prioritized to deliver the core "Swap Loop" first.

#### 3.2.1 User Authentication
*   **Functionality**: Users must be able to create an account using a valid email address and a secure password. The system must support persistent sessions so users don't need to log in repeatedly.
*   **Key Features**:
    *   Sign Up form with validation (email format, password strength).
    *   Login form with error handling (invalid credentials).
    *   Password hash comparison for security.
    *   Logout functionality to clear sessions.

#### 3.2.2 Profile Management
*   **Functionality**: Users need a digital identity to build trust. The profile section acts as their public face on the platform.
*   **Key Features**:
    *   **Dashboard View**: Displays the user's "Trust Score" (calculated from successful trades) and verification status.
    *   **Edit Profile**: Allows updating of avatar image, display name, and bio.
    *   **Settings**: Toggles for email notifications and privacy settings.

#### 3.2.3 Post Ad (Asset Deployment)
*   **Functionality**: The core supply mechanism. Users "deploy" assets into the marketplace.
*   **Key Features**:
    *   **Image Gallery**: Drag-and-drop upload for multiple high-res images.
    *   **Structured Data Entry**: standardized fields for Category (Electronics, Fashion), Condition (New, Used - Good), and Location.
    *   **AI Valuation Check**: A button to "Check Fair Value," which triggers the AI service to analyze the inputs and pre-fill the estimated LTP value.
    *   **Publishing**: Commits the item to the database, making it visible in the explore feed.

#### 3.2.4 Marketplace Discovery
*   **Functionality**: The demand mechanism. Users browse to find items they desire.
*   **Key Features**:
    *   **Explore Feed**: An infinite-scroll grid of item cards.
    *   **Advanced Filtering**: Filter by Price Range (LTP), Distance, Category, and Posting Date.
    *   **Product Detail Page (PDP)**: A dedicated page for each item showing full descriptions, seller profile links, and the "Make Offer" call-to-action.

#### 3.2.5 AI Valuation & Smart Match
*   **Functionality**: The intelligence layer that adds unique value to SwapIt.
*   **Key Features**:
    *   **Quality Analysis**: System analyzes description length and image count to score the "Listing Quality."
    *   **Value Estimation**: System provides a min-max LTP range based on market data.
    *   **Similar Items**: On any PDP, the system displays "You might also like" items based on visual similarity and category matching.

#### 3.2.6 Wishlist (Vault)
*   **Functionality**: A bookmarking system for users to save items they are considering.
*   **Key Features**:
    *   **Save/Unsave**: One-click toggle on item cards.
    *   **Wishlist View**: A private gallery of saved items.
    *   **Move to Cart**: High-intent action to convert a wishlisted item into an active trade negotiation.

#### 3.2.7 Bidding & Trading
*   **Functionality**: The transaction execution layer.
*   **Key Features**:
    *   **Make Offer**: Users can offer one of their own items OR a specific amount of LTP (or a mix of both).
    *   **Bid Management**: Sellers can view all incoming offers in a list.
    *   **Accept/Reject**: Sellers can accept a bid (locking the trade) or reject it (notifying the buyer).
    *   **Trade Completion**: Both parties mark the trade as "Completed" to update inventory and award Trust Points.

#### 3.2.8 Messaging
*   **Functionality**: Direct communication channel.
*   **Key Features**:
    *   **Real-time Chat**: Messages appear instantly without refreshing.
    *   **Context Awareness**: Chats are linked to specific items/trades so users know what they are discussing.
    *   **History**: Persistent chat logs for dispute resolution.

#### 3.2.9 Admin Dashboard
*   **Functionality**: Platform oversight.
*   **Key Features**:
    *   **User Management**: List of all registered users with "Ban/Suspend" controls.
    *   **Item Moderation**: Feed of reported items to review and delete.
    *   **Analytics**: Visual graphs showing daily signups and active trades.

#### 3.2.10 Non-Functional Requirements
*   **Performance**: The application must load the "First Contentful Paint" in under 1.5 seconds on 4G networks.
*   **Reliability**: The system targets 99.9% uptime during business hours.
*   **Scalability**: The backend architecture must support horizontal scaling to handle spikes in concurrent users.
*   **Security**: All sensitive data (passwords) must be salted and hashed. Input forms must be sanitized to prevent SQL injection and XSS attacks.

### 3.3 Figma UI/UX Designs
*(Leave space for Figma Screenshots)*
*To be inserted: High-fidelity mockups of the Login Screen, Marketplace Feed, Product Detail Page, and User Dashboard.*

---

## 4. Project Planning and Execution using Sprints

### 4.1 Jira
Jira was utilized as the primary project management tool. The project was structured as a standard Agile Scrum project.
*   **Epics**: Large feature sets (e.g., "Marketplace Engine", "User Trust System") were defined as Epics.
*   **User Stories**: Epics were broken down into granular User Stories (e.g., "As a user, I want to upload an image so that buyers can see my item").
*   **Kanban Board**: A board with columns "To Do", "In Progress", "Testing", and "Done" was used to visualize workflow and identify bottlenecks.

### 4.2 Slack
Slack served as the communication headquarters. Dedicated channels (`#dev-frontend`, `#dev-backend`, `#general`) ensured that discussions were organized. Automated integrations with GitHub notified the team of pull requests and merges, keeping everyone in sync.

### 4.3 Github Repository
**URL:** [https://github.com/abdu11ah78/swapit](https://github.com/abdu11ah78/swapit)
The codebase was managed using Git.
*   **Branching Strategy**: We adopted the Gitflow workflow. The `main` branch holds production-ready code. A `develop` branch serves as the integration branch for features. Feature branches (e.g., `feature/login-auth`) are created for specific tasks and merged back via Pull Requests (PRs).

### 4.4 Sprint 1
**Goal**: Core Foundation & UI Framework.
**Duration**: 2 Weeks.
**Focus**: Setting up the development environment, establishing the design system, and implementing the base authentication flows.

#### 4.4.1 Sprint 1 Planning Meeting Minutes
*   **Attendees**: Full Development Team.
*   **Agenda**:
    *   Selection of Tech Stack: Next.js (React) picked for its SEO benefits and developer experience. Tailwind CSS chosen for rapid styling.
    *   Theme Definition: Agreed on a "Modern/Premium" aesthetic using the "Outfit" font family and a teal/slate color palette to convey trust.
    *   Prioritization: "Authentication" and "Home Page Structure" were voted as the highest priority items to unblock listing features in Sprint 2.

#### 4.4.2 Sprint 1 Backlog
The following items were committed to the sprint:
1.  **Repository Setup**: Initialize Next.js project and configure ESLint/Prettier.
2.  **Design System**: Create base Tailwind configuration (`tailwind.config.ts`) and global CSS variables.
3.  **Landing Page**: Design and code the responsive hero section and feature highlights.
4.  **Global Layout**: Implement the `Navbar` (with responsive mobile menu) and `Footer`.
5.  **Auth Pages**: Build the UI for Login and Sign Up pages.

#### 4.4.3 Sprint 1 Design Class Diagram
*(Leave space for Diagram)*
*To be inserted: Diagram showing the initial `User` and `AuthService` classes.*

#### 4.4.4 Sprint 1 Sequence Diagram
*(Leave space for Diagram)*
*To be inserted: Diagram showing the flow: User enters credentials -> Frontend validates -> Request sent to API -> Token returned.*

#### 4.4.5 Sprint 1 Decision Table
*(Leave space for Table)*
*To be inserted: Logic table for Login (e.g., If email valid AND password correct -> Success).*

#### 4.4.6 Sprint 1 Extended Test Cases
*(Leave space for Table)*
*To be inserted: Test case 001: "Verify successful login with valid data". Test case 002: "Verify error message on empty fields."*

#### 4.4.7 Sprint 1 Review Meeting
*   **Demo**: The team demonstrated the responsive Landing Page and the interactive navigation menu. The Login form was shown accepting input.
*   **Feedback**: The supervisor noted that the navigation bar felt too cluttered on mobile devices.
*   **Result**: The sprint goal was met. The mobile menu feedback was added to the backlog for the next sprint.

#### 4.4.8 Sprint 1 Retrospective Meeting
*   **What went well**: The adoption of Tailwind CSS significantly sped up the UI development compared to writing custom CSS.
*   **What didn't go well**: There was initial confusion regarding the "Protocol" vs "Marketplace" terminology in the code, leading to some naming inconsistencies.
*   **Action Items**: Create a shared "Glossary" document to standardize naming conventions (e.g., always use "Item" instead of "Asset" in the UI).

---

## 5. System Architecture

### 5.1 System Context Diagram
*(Leave space for Diagram)*
The Level 0 Context Diagram portrays SwapIt as a "Black Box" interacting with:
*   **User**: Providing inputs and receiving service.
*   **Admin**: Providing moderation.
*   **External APIs**: Valuation service and Image Hosting.

### 5.2 System Container Diagram
*(Leave space for Diagram)*
This diagram breaks the system down into containers:
*   **Web App**: The Next.js frontend running in the user's browser.
*   **API Application**: The backend server (Next.js Server Actions/API Routes) handling business logic.
*   **Database**: The storage container (relational DB) holding data.

### 5.3 Component Diagram
*(Leave space for Diagram)*
Detailed view of the functional components:
*   **AuthComponent**: Handles login/signup.
*   **ListingManager**: Manage CRUD operations for items.
*   **SearchEngine**: Handles query parsing and filtering.
*   **ChatSystem**: Manages WebSocket connections for messaging.

### 5.4 Code Diagrams
*(Leave space for Diagram)*
Specific class structures showing inheritance and relationships, such as the `Item` class inheriting properties from a base `Entity` class.

### 5.5 ERD (Entity Relationship Diagram)
*(Leave space for Diagram)*
The database schema is designed around the central "Trade" concept.
*   **Users** have a one-to-many relationship with **Items**.
*   **Items** have a one-to-many relationship with **Bids**.
*   **Transactions** link a **Buyer**, a **Seller**, and an **Item** in a single record.
*   **Users** have a one-to-one relationship with their **Profile/Wallet**.

### 5.6 Data Dictionary
*   **User**:
    *   `id` (UUID): Unique identifier.
    *   `email` (String): User's login email.
    *   `trust_score` (Int): Reputation metric (0-100).
*   **Item**:
    *   `id` (UUID): Unique identifier.
    *   `owner_id` (UUID): Link to User table.
    *   `ltp_value` (Int): The AI-assigned or user-set point value.
    *   `images` (Array[String]): URLs to stored images.
*   **Trade**:
    *   `id` (UUID): Unique identifier.
    *   `status` (Enum): PENDING, ACCEPTED, REJECTED, COMPLETED.
    *   `created_at` (Timestamp): Date of offer.
