CREATE TABLE customers (
    CustomerID     VARCHAR(10) PRIMARY KEY,
    CustomerName   TEXT NOT NULL,
    JoinDate       DATE NOT NULL,
    TenureYears    NUMERIC(4,2),
    Segment        TEXT
);

CREATE TABLE customer_accounts (
    cust_id           VARCHAR(10) PRIMARY KEY,
    external_account  VARCHAR(20) UNIQUE NOT NULL,
    SegmentTag        TEXT
);

CREATE TABLE discount_rules (
    MinPortfolioValueFromUSD NUMERIC(12,2),
    MinTenureYears           NUMERIC(4,2),
    BaseDiscountPct          NUMERIC(5,4),
    TenureBonusPct           NUMERIC(5,4)
);

CREATE TABLE currency_rates (
    Currency       CHAR(3) PRIMARY KEY,
    RateDate       DATE NOT NULL,
    USD_per_unit   NUMERIC(10,4) NOT NULL
);


CREATE TABLE customer_holdings (
    CustomerID   VARCHAR(10) REFERENCES customers(CustomerID),
    Ticker       VARCHAR(10) NOT NULL,
    Quantity     INTEGER NOT NULL,
    AsOfDate     DATE NOT NULL,
    PRIMARY KEY (CustomerID, Ticker, AsOfDate)
);

CREATE TABLE stock_prices (
    Ticker     VARCHAR(10) NOT NULL,
    PriceDate  DATE NOT NULL,
    Close      NUMERIC(12,2) NOT NULL,
    Currency   CHAR(3) NOT NULL,
    PRIMARY KEY (Ticker, PriceDate)
);


CREATE TABLE companies (
    Ticker        VARCHAR(10) PRIMARY KEY,
    CompanyName   TEXT NOT NULL,
    Exchange      VARCHAR(10),
    Currency      CHAR(3),
    Sector        TEXT,
    Country       CHAR(2)
);

CREATE TABLE trades (
    Customer_ID     VARCHAR(10) REFERENCES customers(CustomerID),
    TradeDate       DATE NOT NULL,
    Ticker          VARCHAR(10) REFERENCES companies(Ticker),
    Side            VARCHAR(4) CHECK (Side IN ('BUY', 'SELL')),
    Quantity        INTEGER NOT NULL,
    Px              NUMERIC(12,2) NOT NULL,
    TradeCurrency   CHAR(3) NOT NULL,
    FeeUSD          NUMERIC(10,2),
    PRIMARY KEY (Customer_ID, TradeDate, Ticker, Side)
);

