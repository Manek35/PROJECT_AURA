%% Agentic AI Conversational Retail Assistant – System Architecture
%% Orientation: left to right
graph LR
  %% Customer Interaction Channels (light blue)
  subgraph Customer_Interaction_Channels["Customer Interaction Channels"]
    MobileApp["Mobile App<br/>Chatbot"]
    WebChat["Web Chat<br/>Widget"]
    WhatsApp["WhatsApp /<br/>Telegram Bot"]
    Kiosk["In-Store Kiosk /<br/>Voice Assistant"]
  end

  %% Agentic AI Core Layer (soft yellow)
  subgraph Agentic_AI_Core["Agentic AI Core Layer"]
    SalesAgent["Sales Agent<br/>(Orchestrator)<br/><i>Manages conversation flow, routes tasks to worker agents</i>"]
  end

  %% Worker Agents Layer (light green)
  subgraph Worker_Agents["Worker Agents Layer"]
    RecAgent["Recommendation Agent"]
    InventoryAgent["Inventory Agent"]
    PaymentAgent["Payment Agent"]
    FulfillmentAgent["Fulfillment Agent"]
    LoyaltyAgent["Loyalty & Offers Agent"]
    PostPurchaseAgent["Post-Purchase Support Agent"]
  end

  %% Data & Integration Layer (light purple / backend)
  subgraph Data_Integration["Data & Integration Layer (Backend Services)"]
    CustomerDB["Customer Profile<br/>Database"]
    ProductCatalog["Product Catalog API"]
    InventoryServer["Inventory Server"]
    PaymentGateway["Payment Gateway Stub"]
    LoyaltyEngine["Loyalty / Promotion Engine"]
    POS["POS System<br/>(In-store terminal)"]
  end

  %% Channel -> Sales Agent (User Query)
  MobileApp -->|User Query| SalesAgent
  WebChat  -->|User Query| SalesAgent
  WhatsApp -->|User Query| SalesAgent
  Kiosk    -->|User Query| SalesAgent

  %% Sales Agent -> Worker Agents (Task Delegation)
  SalesAgent -->|Task Delegation| RecAgent
  SalesAgent -->|Task Delegation| InventoryAgent
  SalesAgent -->|Task Delegation| PaymentAgent
  SalesAgent -->|Task Delegation| FulfillmentAgent
  SalesAgent -->|Task Delegation| LoyaltyAgent
  SalesAgent -->|Task Delegation| PostPurchaseAgent

  %% Worker Agents -> Backends (API Request / Response)
  RecAgent -->|API Request| ProductCatalog
  ProductCatalog -->|API Response| RecAgent

  InventoryAgent -->|API Request| InventoryServer
  InventoryServer -->|API Response| InventoryAgent

  PaymentAgent -->|API Request| PaymentGateway
  PaymentGateway -->|API Response| PaymentAgent

  FulfillmentAgent -->|API Request| POS
  POS -->|API Response| FulfillmentAgent

  LoyaltyAgent -->|API Request| LoyaltyEngine
  LoyaltyEngine -->|API Response| LoyaltyAgent

  PostPurchaseAgent -->|API Request| CustomerDB
  CustomerDB -->|API Response| PostPurchaseAgent

  %% Dashed bi-directional context memory line
  SalesAgent -.->|Context & Preferences Memory| CustomerDB
  CustomerDB -.-> SalesAgent

  %% Legend / Notes (simple layout)
  subgraph Legend["Legend & Notes"]
    L1["Light blue = Customer Channels"]
    L2["Soft yellow = Agentic AI Core (Orchestrator)"]
    L3["Light green = Worker Agents (domain agents)"]
    L4["Light purple = Data & Integration backends"]
    L5["Arrow labels: User Query, Task Delegation, API Request / API Response, Context & Preferences Memory (dashed)"]
  end

  %% Class definitions for colors (renderers that support classDef)
  classDef customer fill:#e6f7ff,stroke:#cceeff;
  classDef core fill:#fff8e6,stroke:#f0d77a;
  classDef worker fill:#f0fff3,stroke:#dfffe6;
  classDef backend fill:#f3eaff,stroke:#e8daff;
  classDef legend fill:#ffffff,stroke:#eee,stroke-width:1;

  class MobileApp,WebChat,WhatsApp,Kiosk customer;
  class SalesAgent core;
  class RecAgent,InventoryAgent,PaymentAgent,FulfillmentAgent,LoyaltyAgent,PostPurchaseAgent worker;
  class CustomerDB,ProductCatalog,InventoryServer,PaymentGateway,LoyaltyEngine,POS backend;
  class L1,L2,L3,L4,L5 legend;


  